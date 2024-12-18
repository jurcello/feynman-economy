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

    constructor(p: p5, balance: Balance, offsetX: number = 50, offsetY: number = 50) {
        this.p = p;
        this.balance = balance;
        this.debitCreditWiths = 100;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.fadeTime = 600;
    }


    draw() {
        const p = this.p;
        const Y = this.offsetY;

        p.text(`Balance: ${this.balance.name}`, this.offsetX, Y);


        this.handleFading();

        this.drawDebit(Y - 20);
        this.drawCredit(Y - 20);
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

    private drawDebit(Y: number) {
        const totalDebits = this.getTotalDebits();
        const p = this.p;
        let currentY = Y;

        currentY = this.drawDebits(p, currentY);
        p.text('Debit / bezittingen', this.offsetX, currentY);
        p.fill(255, 255, 255);
    }

    private drawDebits(p: p5, currentY: number) {
        let Y = currentY;
        p.stroke(255, 255, 255);
        p.strokeWeight(2);
        Object.entries(this.balance.debit).forEach(([key, value]) => {
            p.fill(colorMappings[key as DebitTypes | CreditTypes] || Colors.grey);

            if (this.fading && this.lastTransaction && key === this.lastTransaction?.debit.type) {
                const height = this.fadeValue * this.lastTransaction?.getAmount();
                const correction =  this.lastTransaction?.getAmount();
                let correctedValue = value - correction;
                Y -= correctedValue
                p.rect(this.offsetX, Y, this.debitCreditWiths, correctedValue);

                Y -= height;
                p.rect(this.offsetX, Y, this.debitCreditWiths, height);
            }
            else {
                p.rect(this.offsetX, Y - value, this.debitCreditWiths, value);
                Y -= value; // Adjusting currentY for the next debit block
            }
        });


        p.strokeWeight(0);

        Y -= 10;
        return Y;
    }

    private getTotalDebits() {
        let debit = Object.values(this.balance.debit).reduce((sum, value) => sum + value, 0);
        if (this.fading && this.lastTransaction) {
            debit -= this.lastTransaction?.getAmount();
        }
        return debit;
    }

    private drawCredit(Y: number) {
        const totalCredits = this.getTotalCredits();
        const p = this.p;
        const creditLeft = this.offsetX + this.debitCreditWiths + 10;
        let currentY = Y - totalCredits;

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