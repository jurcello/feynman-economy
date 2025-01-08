import p5 from "p5";
import {Balance, CreditTypes, DebitTypes, Transaction} from "@/balance";
import Colors from "@/colors";

const colorMappings = {
    [DebitTypes.cash]: Colors.green,
    [DebitTypes.backAccount]: Colors.blue,
    [DebitTypes.property]: Colors.purple,
    [DebitTypes.none]: Colors.grey,
    [CreditTypes.equity]: Colors.blue,
    [CreditTypes.debt]: Colors.red,
    [CreditTypes.none]: Colors.grey,

}

class BalanceDrawerExtended {
    private p: p5;
    public balance: Balance;
    private debitCreditWiths: number;
    private offsetX: number;
    private offsetY: number;
    private scale: number = 1;
    private fadeTime: number;
    private fading: boolean = false;
    private fadeValue: number = 0;
    private fadeStartTime: number = 0;
    private lastTransaction?: Transaction;
    public properties: {
        opacity: number,
    }
    private promises: Array<() => void> = [];

    constructor(p: p5, balance: Balance, offsetX: number = 50, offsetY: number = 50, scale: number = 1) {
        this.p = p;
        this.balance = balance;
        this.debitCreditWiths = 100;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.fadeTime = 600;
        this.scale = scale;
        this.properties = {
            opacity: 0,
        }
    }


    draw() {
        const p = this.p;
        const Y = this.offsetY;

        p.text(`Balance: ${this.balance.name}`, this.offsetX, Y);


        this.handleFading();

        p.scale(this.scale);
        this.drawDebit((Y - 20) / this.scale);
        this.drawCredit((Y - 20) / this.scale);
        p.scale(1 / this.scale);
    }
    

    public waitForFadeToEnd(): Promise<void> {
        return new Promise((resolve) => {
            this.promises = this.promises || [];
            this.promises.push(resolve);
        });
    }

    private handleFading(): void {
        if (this.balance.getLastTransaction() && this.lastTransaction != this.balance.getLastTransaction()) {
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
        if (this.promises.length > 0 && !this.fading) {
            this.promises.forEach(promise => promise());
            this.promises = [];
        }
    }

    private drawDebit(Y: number) {
        const p = this.p;
        let currentY = Y;

        let xPosition = this.offsetX;
        currentY = this.drawDebits(p, currentY, xPosition);
        currentY -= 10;
        p.fill(Colors.darkGreen);
        p.text('Debit / bezittingen', xPosition, currentY);
        p.fill(255, 255, 255);
    }

    private drawCredit(Y: number) {
        const p = this.p;
        let currentY = Y;

        let xPosition = this.offsetX + this.debitCreditWiths + 10;
        currentY = this.drawCredits(p, currentY, xPosition);
        currentY -= 10;
        p.fill(Colors.darkRed);
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
        let debitOrCredit = this.balance.credit;
        let type = this.lastTransaction?.credit.type;
        Y = this.drawItems(Y, debitOrCredit, type, xPosition);

        p.strokeWeight(0);
        return Y;
    }

    private drawItems(Y: number, debitOrCredit: { [p: string]: number }, type: DebitTypes | CreditTypes | undefined, xPosition: number) {
        const p = this.p;
        p.stroke(255, 255, 255);
        p.strokeWeight(2);

        Object.entries(debitOrCredit).forEach(([key, value]) => {
            p.fill(colorMappings[key as DebitTypes | CreditTypes] || Colors.grey);
            if (this.fading && this.lastTransaction && key === type && this.lastTransaction.getAmount() > 0) {
                const fadeHeight = this.fadeValue * this.lastTransaction?.getAmount();
                const correction = this.lastTransaction?.getAmount();
                let correctedValue = value - correction;
                Y -= correctedValue
                p.rect(xPosition, Y, this.debitCreditWiths, correctedValue);
                const textPosition = Y + 20;

                Y -= fadeHeight;
                p.rect(xPosition, Y, this.debitCreditWiths, fadeHeight);

                p.strokeWeight(1);
                p.fill(Colors.white);
                if (correctedValue > 40) {
                    p.text(`${key}`, xPosition + 10, textPosition);
                    p.text(this.formatNumber(correctedValue), xPosition + 10, textPosition + 15);
                }
            } else if (this.fading && this.lastTransaction && key === type && this.lastTransaction.getAmount() < 0) {
                const fadeHeight = this.fadeValue * this.lastTransaction?.getAmount();
                const correction = this.lastTransaction?.getAmount();
                let correctedValue = value + fadeHeight - correction;
                Y -= correctedValue
                p.rect(xPosition, Y, this.debitCreditWiths, correctedValue);
                const textPosition = Y + 20;

                p.strokeWeight(1);
                p.fill(Colors.white);
                p.text(`${key}`, xPosition + 10, textPosition);
                p.text(this.formatNumber(correctedValue), xPosition + 10, textPosition + 15);

            } else {
                let rectPosition = Y - value;
                p.rect(xPosition, rectPosition, this.debitCreditWiths, value);
                const textPosition = rectPosition + 20;
                p.strokeWeight(1);
                p.fill(Colors.white);
                if (value > 40) {
                    p.text(`${key}`, xPosition + 10, textPosition);
                    p.text(this.formatNumber(value), xPosition + 10, textPosition + 15);
                }
                Y -= value;
            }
        });
        return Y;
    }


    private formatNumber(totalCredits: number) {
        return new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR'
        }).format(totalCredits);
    }
}

export default BalanceDrawerExtended;