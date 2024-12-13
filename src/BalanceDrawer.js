class BalanceDrawer {
    constructor(p, balance) {
        this.p = p;
        this.balance = balance;
    }


    draw() {
        this.p.text(`Balance: ${this.balance}`, 50, 50);
    }
}

export default BalanceDrawer;