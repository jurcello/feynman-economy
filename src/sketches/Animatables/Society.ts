import BalanceDrawerExtended from "@/sketches/Animatables/BalanceDrawerExtended";
import p5 from "p5";
import {Balance} from "@/balance";

class Society {
    public banksBalances: Map<string,BalanceDrawerExtended>;

    constructor(p: p5, banks: Array<string>) {

        this.banksBalances = new Map();

        banks.forEach((bank) => {
            const balance = new Balance(bank);
            const BalanceDrawer = new BalanceDrawerExtended(p, balance);
            this.banksBalances.set(bank, BalanceDrawer);
        });
    }

    public draw() {
        this.banksBalances.forEach((balanceDrawer) => {
            balanceDrawer.draw();
        });
    }

    public getBalanceDrawer(bank: string): BalanceDrawerExtended | undefined {
        return this.banksBalances.get(bank);
    }
}

export default Society;