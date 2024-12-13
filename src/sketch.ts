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
    let balanceDrawer  = new BalanceDrawer(p, personBalance);

    p.draw = () => {
        p.fill(100);
        balanceDrawer.draw();
    };
};

// Initialize p5 instance
new p5(sketch);