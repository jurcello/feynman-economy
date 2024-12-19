import p5 from "p5";
import {Balance, CreditTypes, DebitTypes, Transaction} from "../balance";
import BalanceDrawer from "../BalanceDrawer";

const createSkatch = (canvasContainer: HTMLDivElement, personBalance: Balance) => (p: p5) => {
    let canvas;

    const height = 500;
    p.setup = () => {
        canvas = p.createCanvas(800, height);

        // Attach the canvas to a container (use `#p5-container`)
        canvas.parent(canvasContainer);

        p.background(220);
    };

    let balanceDrawer  = new BalanceDrawer(p, personBalance, 20, height - 20);

    p.draw = () => {
        p.fill(100);
        p.background(220);
        balanceDrawer.draw();
    };


    p.keyPressed = () => {
        if (p.key === 'a' || p.key === 'A') {
            // Create and add a new transaction when 'a' is pressed
            const newTransaction = new Transaction('New Transaction', - Math.random() * 100, { type: DebitTypes.cash}, {type: CreditTypes.equity});
            personBalance.addTransaction(newTransaction);

            // Optionally, update the display or log the transaction
            console.log('Transaction added:', newTransaction);
        }
    };
};

export default createSkatch;