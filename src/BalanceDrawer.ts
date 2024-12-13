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
        this.p.text(`Balance: ${this.balance}`, 50, 50);
    }
}

export default BalanceDrawer;