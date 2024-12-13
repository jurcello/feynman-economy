class Transaction {
    private description: string;
    private amount: number;

    getAmount(): number {
        return this.amount;
    }

    debit: { type: string };
    credit: { type: string };

    constructor() {
        this.description = 'Test';
        this.amount = 100;
        this.debit = {
            type: 'cash',
        };
        this.credit = {
            type: 'equity',
        };
    }
}

class Balance {
    private name: string;
    private debit: { [key: string]: number };
    private credit: { [key: string]: number };
    private transactions: Transaction[];

    constructor(name: string) {
        this.name = name;
        this.debit = {};
        this.credit = {};
        this.transactions = [];
    }

    addTransaction(transaction: Transaction) {
        this.transactions.push(transaction);
        this.debit[transaction.debit.type] = transaction.getAmount();
        this.credit[transaction.credit.type] = transaction.getAmount();
    }

    getLastTransaction() {
        return this.transactions[this.transactions.length - 1];
    }
}

export { Balance, Transaction };