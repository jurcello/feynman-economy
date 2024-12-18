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
        const p = this.p;
        let currentY = Y;

        let xPosition = this.offsetX;
        currentY = this.drawDebits(p, currentY, xPosition);
        currentY -= 10;
        p.text('Debit / bezittingen', xPosition, currentY);
        p.fill(255, 255, 255);
    }

    private drawCredit(Y: number) {
        const p = this.p;
        let currentY = Y;

        let xPosition = this.offsetX + this.debitCreditWiths + 10;
        currentY = this.drawCredits(p, currentY, xPosition);
        currentY -= 10;
        p.text('Credit / Verplichtingen', xPosition, currentY);
        p.fill(255, 255, 255);
    }

    private drawDebits(p: p5, currentY: number, xPosition: number) {
        let Y = currentY;
        p.stroke(255, 255, 255);
        p.strokeWeight(2);
        let debitOrCredit = this.balance.debit;
        let type = this.lastTransaction?.debit.type;
        Y = this.drawItems(Y, debitOrCredit, type, xPosition);

        p.strokeWeight(0);
        return Y;
    }

    private drawCredits(p: p5, currentY: number, xPosition: number) {
        let Y = currentY;
        p.stroke(255, 255, 255);
        p.strokeWeight(2);
        let debitOrCredit = this.balance.credit;
        let type = this.lastTransaction?.credit.type;
        Y = this.drawItems(Y, debitOrCredit, type, xPosition);

        p.strokeWeight(0);
        return Y;
    }

    private drawItems(Y: number, debitOrCredit: { [p: string]: number }, type: DebitTypes | CreditTypes | undefined, xPosition: number) {
        const p = this.p;
        Object.entries(debitOrCredit).forEach(([key, value]) => {
            p.fill(colorMappings[key as DebitTypes | CreditTypes] || Colors.grey);
            if (this.fading && this.lastTransaction && key === type) {
                const height = this.fadeValue * this.lastTransaction?.getAmount();
                const correction = this.lastTransaction?.getAmount();
                let correctedValue = value - correction;
                Y -= correctedValue
                p.rect(xPosition, Y, this.debitCreditWiths, correctedValue);

                Y -= height;
                p.rect(xPosition, Y, this.debitCreditWiths, height);
            } else {
                p.rect(xPosition, Y - value, this.debitCreditWiths, value);
                Y -= value; // Adjusting currentY for the next debit block
            }
        });
        return Y;
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