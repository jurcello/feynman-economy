import p5 from "p5";
import {Balance} from "./balance";

class BalanceDrawer {
    private p: p5;
    private balance: Balance;
    private debitCreditWiths: number;
    private offsetX: number;
    private offsetY: number;

    constructor(p: p5, balance: Balance) {
        this.p = p;
        this.balance = balance;
        this.debitCreditWiths = 100;
        this.offsetX = 50;
        this.offsetY = 50;
    }


    draw() {
        const p = this.p;
        this.offsetY = p.height - 50;

        p.text(`Balance: ${this.balance.name}`, this.offsetX, this.offsetY);

        this.drawDebit();
        this.drawCredit();
    }

    private drawDebit() {
        const totalDebits = Object.values(this.balance.debit).reduce((sum, value) => sum + value, 0);
        const p = this.p;
        let totalBalanceY = this.offsetY - 20 - totalDebits;
        p.text('Debit', this.offsetX, totalBalanceY - 10);
        p.rect(this.offsetX, totalBalanceY, this.debitCreditWiths, totalDebits);
    }

    private drawCredit() {
        const totalCredits = Object.values(this.balance.credit).reduce((sum, value) => sum + value, 0);
        const p = this.p;
        const creditLeft = this.offsetX + this.debitCreditWiths + 10;
        let totalBalanceY = this.offsetY - 20 - totalCredits;
        p.fill(0, 100, 0);
        p.text('Credit', creditLeft, totalBalanceY - 10);
        p.rect(creditLeft, totalBalanceY, this.debitCreditWiths, totalCredits);
    }
}

export default BalanceDrawer;