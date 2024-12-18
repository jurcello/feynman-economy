import p5 from "p5";
import {Balance, CreditTypes, DebitTypes, Transaction} from "./balance";
import Colors from "./colors";

const colorMappings = {
    [DebitTypes.cash]: Colors.green,
    [DebitTypes.backAccount]: Colors.blue,
    [CreditTypes.equity]: Colors.red
}

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
        this.fadeTime = 600;
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
        let currentY = this.offsetY - 20 - totalDebits;

        p.fill(Colors.green);

        p.stroke(255, 255, 255);
        p.strokeWeight(2);
        p.rect(this.offsetX, currentY, this.debitCreditWiths, totalDebits);

        if (this.fading && this.lastTransaction) {
            const height = this.fadeValue * this.lastTransaction?.getAmount();
            currentY -= height;
            p.rect(this.offsetX, currentY, this.debitCreditWiths, height);
        }

        p.strokeWeight(0);

        currentY -= 10;
        p.text('Debit / bezittingen', this.offsetX, currentY);
        p.fill(255, 255, 255);
        p.text(`Total: ${this.formatNumber(totalDebits)}`, this.offsetX + 10, this.offsetY - 30);
        p.text(`${this.balance.getLastTransaction().debit.type}`, this.offsetX + 10, this.offsetY - 45);
    }

    private getTotalDebits() {
        let debit = Object.values(this.balance.debit).reduce((sum, value) => sum + value, 0);
        if (this.fading && this.lastTransaction) {
            debit -= this.lastTransaction?.getAmount();
        }
        return debit;
    }

    private drawCredit() {
        const totalCredits = this.getTotalCredits();
        const p = this.p;
        const creditLeft = this.offsetX + this.debitCreditWiths + 10;
        let currentY = this.offsetY - 20 - totalCredits;

        p.fill(Colors.red);

        p.stroke(255, 255, 255);
        p.strokeWeight(2);
        p.rect(creditLeft, currentY, this.debitCreditWiths, totalCredits);


        if (this.fading && this.lastTransaction) {
            const height = this.fadeValue * this.lastTransaction?.getAmount();
            currentY -= height;
            p.rect(creditLeft, currentY, this.debitCreditWiths, height);
        }

        p.strokeWeight(0);
        currentY -= 10;
        p.text('Credit / Verplichtingen', creditLeft, currentY);
        p.fill(255, 255, 255);
        p.text(`Total: ${(this.formatNumber(totalCredits))}`, creditLeft + 10, this.offsetY - 30);
        p.text(`${this.balance.getLastTransaction().credit.type}`, creditLeft + 10, this.offsetY - 45);
    }

    private getTotalCredits() {
        let credit = Object.values(this.balance.credit).reduce((sum, value) => sum + value, 0);
        if (this.fading && this.lastTransaction) {
            credit -= this.lastTransaction?.getAmount();
        }
        return credit;
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