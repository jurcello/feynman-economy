enum DebitTypes {
    cash = 'Cash',
    backAccount = 'Back account',
    none = 'None',
}

enum CreditTypes {
    equity = 'Eigen vermogen',
    debt = 'Schulden',
    none = 'None',
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
}

class BalanceStatus {
    public inBalance: boolean = true;
}

type BalanceStatusCallback = (status: BalanceStatus) => void;

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

    addTransaction(transaction: Transaction) {
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

    getLastTransaction() {
        return this.transactions[this.transactions.length - 1];
    }


    registerBalanceStatusCallback(callback: (status: BalanceStatus) => void): void {
        this.balanceStatusCallback = callback;
    }
}

export { Balance, Transaction, DebitTypes, CreditTypes, BalanceStatus, BalanceStatusCallback };