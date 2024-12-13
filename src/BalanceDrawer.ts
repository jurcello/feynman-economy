import p5 from "p5";
import {Balance} from "./balance";

class BalanceDrawer {
    private p: p5;
    private balance: Balance;

    constructor(p: p5, balance: Balance) {
        this.p = p;
        this.balance = balance;
    }


    draw() {
        const p = this.p;
        const left = 50;
        const bottom = 50;
        const totalDebits = Object.values(this.balance.debit).reduce((sum, value) => sum + value, 0);
        const totalCredits = Object.values(this.balance.credit).reduce((sum, value) => sum + value, 0);

        p.text(`Balance: ${this.balance.name}`, left, p.height - bottom);

        let totalBalanceY = p.height - bottom - 20 - totalDebits;
        let debitWidth = 100;
        let creditWith = 100;
        p.text('Debit', left, totalBalanceY - 10);
        p.rect(left, totalBalanceY, debitWidth, totalDebits);

        p.fill(0, 100, 0);
        const creditLeft = left + debitWidth + 10;
        p.text('Credit', creditLeft, totalBalanceY - 10);
        p.rect(creditLeft, totalBalanceY, creditWith, totalCredits);
    }
}

export default BalanceDrawer;