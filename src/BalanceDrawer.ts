import p5 from "p5";
import {Balance, Transaction} from "./balance";

class BalanceDrawer {
    private p: p5;
    private balance: Balance;
    private debitCreditWiths: number;
    private offsetX: number;
    private offsetY: number;
    private fadeTime: number;
    private fading: boolean = false;
    private fadeValue: number = 0;
    private fadeStartTime: number = 0;
    private lastTransaction?: Transaction;

    constructor(p: p5, balance: Balance) {
        this.p = p;
        this.balance = balance;
        this.debitCreditWiths = 100;
        this.offsetX = 50;
        this.offsetY = 50;
        this.fadeTime = 1000;
    }


    draw() {
        const p = this.p;
        this.offsetY = p.height - 50;

        p.text(`Balance: ${this.balance.name}`, this.offsetX, this.offsetY);

        if (this.fading) {
            p.rect(this.offsetX + 100, this.offsetY, this.fadeValue * 200, 20);
        }

        this.handleFading();

        this.drawDebit();
        this.drawCredit();
    }

    private handleFading(): void {
        if (this.lastTransaction && this.lastTransaction != this.balance.getLastTransaction()) {
            this.fading = true;
            this.fadeStartTime = this.p.millis();
        }
        if (this.fading) {
            this.fadeValue = (this.p.millis() - this.fadeStartTime) / this.fadeTime;
            if (this.fadeValue > 1) {
                this.fading = false;
                this.fadeValue = 0;
            }
        }
        this.lastTransaction = this.balance.getLastTransaction();
    }

    private drawDebit() {
        const totalDebits = this.getTotalDebits();
        const p = this.p;
        let totalBalanceY = this.offsetY - 20 - totalDebits;
        p.text('Debit', this.offsetX, totalBalanceY - 10);
        p.rect(this.offsetX, totalBalanceY, this.debitCreditWiths, totalDebits);
        p.fill(255, 255, 255);
        p.text(`Total: ${this.formatNumber(totalDebits)}`, this.offsetX + 10, this.offsetY - 30);
    }

    private getTotalDebits() {
        return Object.values(this.balance.debit).reduce((sum, value) => sum + value, 0);
    }

    private drawCredit() {
        const totalCredits = this.getTotalCredits();
        const p = this.p;
        const creditLeft = this.offsetX + this.debitCreditWiths + 10;
        let totalBalanceY = this.offsetY - 20 - totalCredits;

        p.fill(0, 100, 0);
        p.text('Credit', creditLeft, totalBalanceY - 10);
        p.rect(creditLeft, totalBalanceY, this.debitCreditWiths, totalCredits);
        p.fill(255, 255, 255);
        p.text(`Total: ${(this.formatNumber(totalCredits))}`, creditLeft + 10, this.offsetY - 30);
    }

    private getTotalCredits() {
        return Object.values(this.balance.credit).reduce((sum, value) => sum + value, 0);
    }

    private formatNumber(totalCredits: number) {
        const formattedCredits = new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR'
        }).format(totalCredits);
        return formattedCredits;
    }
}

export default BalanceDrawer;