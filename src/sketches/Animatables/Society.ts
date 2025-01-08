import BalanceDrawerExtended from "@/sketches/Animatables/BalanceDrawerExtended";
import p5 from "p5";
import {Balance, MoneyAggregates} from "@/balance";


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
    
    getMoneyAggregates(): MoneyAggregates {
        let total = 0;
        let cash = 0;

        this.banksBalances.forEach((balanceDrawer) => {
            const moneyAggregates = balanceDrawer.balance.getTotalMoneyAggregates();
            total += moneyAggregates.total;
            cash += moneyAggregates.cash;
        });

        return {total, cash};
    }

    public getBalanceDrawer(bank: string): BalanceDrawerExtended {
        const balanceDrawer = this.banksBalances.get(bank);
        if (!balanceDrawer) {
            throw new Error(`BalanceDrawer not found: ${bank}`);
        }
        return balanceDrawer;
    }
}

export default Society;