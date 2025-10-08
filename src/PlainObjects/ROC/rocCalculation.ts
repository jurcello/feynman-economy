import { reactive, type Reactive } from 'vue';

export interface ResourceCredit {
  amount: number;
  unitOfMeasurement: string; // e.g., 'ton CO2e', 'kg', etc.
  cost: number; // total cost associated with the amount in base currency
}

export class CarbonCredit implements ResourceCredit {
    constructor({
                    amount = 0,
                    unitOfMeasurement = 'ton CO2e',
                    cost = 0
                }: {
        amount?: number;
        unitOfMeasurement?: string;
        cost?: number;
    } = {}) {
        this.amount = amount;
        this.unitOfMeasurement = unitOfMeasurement;
        this.cost = cost;
    }

    amount: number;
    unitOfMeasurement: string;
    cost: number;
}


/**
 * ROC (Return on Capital/Investment) domain object
 *
 * Base (mutable) inputs with getters and setters:
 *  - profit (aka NOPAT)
 *  - equity
 *  - debt
 *  - costOfDebt (as decimal, e.g., 0.05 for 5%)
 *
 * Derived read-only properties (computed internally and exposed via getters only):
 *  - investedCapital = equity + debt
 *  - totalCapital (alias of investedCapital)
 *  - interestExpense = debt * costOfDebt
 *  - roi = profit / investedCapital (0 when investedCapital = 0)
 *  - roe = profit / equity (0 when equity = 0)
 *  - debtRatio = debt / investedCapital (0 when investedCapital = 0)
 *  - equityRatio = equity / investedCapital (0 when investedCapital = 0)
 *
 * Changing any base property triggers a recalculation of derived values.
 */
export class ROC {
  // base inputs
  private _profit: number;
  private _equity: number;
  private _debt: number;
  private _costOfDebt: number; // decimal, e.g. 0.05 = 5%

  // cached derived values
  private _investedCapital = 0;
  private _interestExpense = 0;
  private _roc = 0;
  private _roe = 0;
  private _debtRatio = 0;
  private _equityRatio = 0;
  private _var95 = 0;
  private _carbonCredits: ResourceCredit[] = [];

  constructor({ profit = 0, equity = 0, debt = 0, costOfDebt = 0, carbonCredits = [] }: {
    profit?: number;
    equity?: number;
    debt?: number;
    costOfDebt?: number;
    carbonCredits?: ResourceCredit[];
  } = {}) {
    this._profit = profit;
    this._equity = equity;
    this._debt = debt;
    this._costOfDebt = costOfDebt;
    this._carbonCredits = Array.isArray(carbonCredits) ? carbonCredits : [];
    this.recalculate();
  }

  // setters trigger recalculation
  set profit(value: number) {
    this._profit = value;
    this.recalculate();
  }
  get profit(): number {
    return this._profit;
  }

  set equity(value: number) {
    this._equity = value;
    this.recalculate();
  }
  get equity(): number {
    return this._equity;
  }

  set debt(value: number) {
    this._debt = value;
    this.recalculate();
  }
  get debt(): number {
    return this._debt;
  }

  set costOfDebt(value: number) {
    this._costOfDebt = value;
    this.recalculate();
  }
  get costOfDebt(): number {
    return this._costOfDebt;
  }

  // derived (read-only) getters
  get investedCapital(): number {
    return this._investedCapital;
  }
  // alias for convenience
  get totalCapital(): number {
    return this._investedCapital;
  }

  get interestExpense(): number {
    return this._interestExpense;
  }

  get roc(): number {
    return this._roc;
  }

  get roe(): number {
    return this._roe;
  }

  get debtRatio(): number {
    return this._debtRatio;
  }

  get equityRatio(): number {
    return this._equityRatio;
  }

  get var95(): number {
    return this._var95;
  }

  set carbonCredits(value: ResourceCredit[]) {
    this._carbonCredits = Array.isArray(value) ? value : [];
    this.recalculate();
  }
  get carbonCredits(): ResourceCredit[] {
    return this._carbonCredits;
  }

  get carbonCreditAmount(): number {
    return this._carbonCredits.length;
  }

  get carbonCreditCosts(): number {
    return this._carbonCredits.reduce((sum, rc) => sum + (rc.amount ?? 0), 0);
  }

  // core recompute method
  private recalculate(): void {
    const invested = clampNonNegative(this._equity) + clampNonNegative(this._debt);
    this._investedCapital = invested;

    this._interestExpense = clampNonNegative(this._debt) * this._costOfDebt;

    this._roc = safeDivide(this._profit, invested);
    // ROE should reflect returns to equity holders after servicing debt
    this._roe = safeDivide(this._profit - this._interestExpense, this._equity);

    this._debtRatio = safeDivide(this._debt, invested);
    this._equityRatio = safeDivide(this._equity, invested);

    // Simple VaR (95%) proxy using interest expense as the risk driver under normal assumption (z=1.645)
    const Z_95 = 1.645;
    this._var95 = Z_95 * Math.abs(this._interestExpense);
  }
}


function clampNonNegative(n: number): number {
  return n < 0 ? 0 : n;
}

function safeDivide(num: number, den: number): number {
  return den === 0 ? 0 : num / den;
}

export function createROC(initial?: {
  profit?: number;
  equity?: number;
  debt?: number;
  costOfDebt?: number;
  carbonCredits?: ResourceCredit[];
}): Reactive<ROC> {
  return reactive(new ROC(initial ?? {}));
}
