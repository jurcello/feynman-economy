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

class Balance {
    public name: string;
    public debit: { [key: string]: number };
    public credit: { [key: string]: number };
    private transactions: Transaction[];

    constructor(name: string) {
        this.name = name;
        this.debit = {};
        this.credit = {};
        this.transactions = [];
    }

    addTransaction(transaction: Transaction) {
        this.transactions.push(transaction);
        if (transaction.debit.type != DebitTypes.none) {
            this.debit[transaction.debit.type] = (this.debit[transaction.debit.type] || 0) + transaction.getAmount();            
        }
        if (transaction.credit.type != CreditTypes.none) {
            this.credit[transaction.credit.type] = (this.credit[transaction.credit.type] || 0) + transaction.getAmount();
        }
    }

    getLastTransaction() {
        return this.transactions[this.transactions.length - 1];
    }
}

export { Balance, Transaction, DebitTypes, CreditTypes };