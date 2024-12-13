import p5 from "p5";
import {Balance, Transaction} from "./balance";
import BalanceDrawer from "./BalanceDrawer";

const sketch = (p: p5) => {
    let canvas;

    p.setup = () => {
        canvas = p.createCanvas(600, 400);

        // Attach the canvas to a container (use `#p5-container`)
        canvas.parent("p5-container");

        p.background(220);
    };

    let personBalance = new Balance('John');
    let transaction: Transaction = new Transaction('Initial', 10, { type: 'cash'}, {type: 'Eigen vermogen'});
    personBalance.addTransaction(transaction);
    let balanceDrawer  = new BalanceDrawer(p, personBalance);

    p.draw = () => {
        p.fill(100);
        p.background(220);
        balanceDrawer.draw();
    };


    p.keyPressed = () => {
        if (p.key === 'a' || p.key === 'A') {
            // Create and add a new transaction when 'a' is pressed
            const newTransaction = new Transaction('New Transaction', Math.random() * 100, {type: 'cash'}, {type: 'Eigen vermogen'});
            personBalance.addTransaction(newTransaction);

            // Optionally, update the display or log the transaction
            console.log('Transaction added:', newTransaction);
        }
    };
};

// Initialize p5 instance
new p5(sketch);