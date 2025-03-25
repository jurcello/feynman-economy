enum DebitTypes {
    cash = 'Cash',
    backAccount = 'Back account',
    property = 'Bezit',
    loan = 'Leningen',
    noneMoney = 'Maakt niet uit',
    nonMoneyHouse = 'Non-Money (House)',
    reserves = 'Reserves',
    currency = 'Valuta',
    deposits = "Deposito's",
    newDeposits = "Nieuwe Deposito's",
    newLoans = "Nieuwe Leningen",
    none = 'NoneDebit',
}

enum CreditTypes {
    equity = 'Eigen vermogen',
    debt = 'Schulden',
    creditAccount = 'Credit account',
    savingsAccount = 'Spaarrekeningen',
    reserves = 'Reserves',
    currency = 'Valuta',
    deposits = "Deposito's",
    newDeposits = "Nieuwe Deposito's",
    newLoans = "Nieuwe Leningen",
    noneMoney = 'Maakt niet uit',
    none = 'NoneCredit',
}



class Transaction {
    private description: string;
    private amount: number;

    getAmount(): number {
        return this.amount;
    }

    debit: { type: DebitTypes };
    credit: { type: CreditTypes };

    constructor(description: string, amount: number, debit: { type: DebitTypes }, credit: { type: CreditTypes }) {
        this.description = description;
        this.amount = amount;
        this.debit = debit;
        this.credit = credit;
    }

    public static create(description: string, amount: number, debit: DebitTypes, credit: CreditTypes): Transaction {
        return new Transaction(description, amount, { type: debit }, { type: credit });
    }
}

class BalanceStatus {
    public inBalance: boolean = true;
}

export type BalanceStatusCallback = (status: BalanceStatus) => void;

export type MoneyAggregates = {
    total: number,
    cash: number,
};

export type InitialBalance = {
    debit: { type: DebitTypes, amount: number }[],
    credit: { type: CreditTypes, amount: number }[]
}

class Balance {
    public name: string;
    public debit: { [key: string]: number };
    public credit: { [key: string]: number };
    private transactions: Transaction[];
    private balanceStatus: BalanceStatus;
    private totalDebit: number = 0;
    private totalCredit: number = 0;
    private balanceStatusCallback: BalanceStatusCallback | null = null;

    constructor(name: string) {
        this.name = name;
        this.debit = {};
        this.credit = {};
        this.transactions = [];
        this.balanceStatus = new BalanceStatus();
    }

    public static createFromInitialBalance(name: string, initialBalance: InitialBalance): Balance {
        const balance = new Balance(name);
        for (const debit of initialBalance.debit) {
            balance.debit[debit.type] = debit.amount;
            balance.totalDebit += debit.amount;
        }
        for (const credit of initialBalance.credit) {
            balance.credit[credit.type] = credit.amount;
            balance.totalCredit += credit.amount;
        }
        return balance;
    }
    public clear(): void {
        this.debit = {};
        this.credit = {};
        this.transactions = [];
    }

    public addTransaction(transaction: Transaction) {
        this.transactions.push(transaction);
        if (transaction.debit.type != DebitTypes.none) {
            this.debit[transaction.debit.type] = (this.debit[transaction.debit.type] || 0) + transaction.getAmount();
            this.totalDebit += transaction.getAmount();
        }
        if (transaction.credit.type != CreditTypes.none) {
            this.credit[transaction.credit.type] = (this.credit[transaction.credit.type] || 0) + transaction.getAmount();
            this.totalCredit += transaction.getAmount();
        }
        this.balanceStatus.inBalance = this.totalDebit == this.totalCredit;
        if (this.balanceStatusCallback != null) {
            this.balanceStatusCallback(this.balanceStatus);
        }
    }

    getTotalMoneyAggregates(): MoneyAggregates {
        return {
            total: this.totalDebit,
            cash: this.debit[DebitTypes.cash] || 0,
        };
    }

    public getCoverage() {
        return (this.debit[DebitTypes.cash] || 0 / this.totalDebit);
    }

    getLastTransaction() {
        return this.transactions[this.transactions.length - 1];
    }


    registerBalanceStatusCallback(callback: (status: BalanceStatus) => void): void {
        this.balanceStatusCallback = callback;
    }
}

export { Balance, Transaction, DebitTypes, CreditTypes, BalanceStatus };