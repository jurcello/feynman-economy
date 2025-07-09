import {Balance, Transaction} from "@/balance";
import {ScrollTrigger} from "@/plugins/gsap";

const createRevertableTransaction = (elementName: string, balance: Balance, transaction: Transaction) => {
    const elementId = `#${elementName}`;
    ScrollTrigger.create({
        trigger: elementId,
        start: 'top center-=100px',
        onEnter: () => {
            balance.addTransaction(transaction);
        },
        onEnterBack: () => {
            balance.revertTransaction(transaction);
        }
    });

};
export {createRevertableTransaction}