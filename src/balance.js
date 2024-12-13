class Transaction {

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
    constructor(name) {
        this.name = name;
        this.debet = {};
        this.credit = {};
        this.transactions = [];
    }

    addTransaction(transaction) {
        this.transactions.push(transaction);
        this.debet[transaction.debit.type] = transaction.amount;
        this.credit[transaction.credit.type] = transaction.amount;
    }

    getLastTransaction() {
        return this.transactions[this.transactions.length - 1];
    }
}

export { Balance, Transaction };