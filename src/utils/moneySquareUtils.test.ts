import {describe, expect, it} from "vitest";

class MoneyDestination {
    public config: MoneyDestinationConfig;

    constructor(
        public name: string,
        public amount: number
    ) {
        this.config = new MoneyDestinationConfig({
            blockSize: 10,
            blocksPerRow: 10,
            blockGutter: 2,
        });
    }
}

class MoneyDestinationConfig {
    public blockSize: number;
    public blocksPerRow: number;
    public blockGutter: number;

    constructor(param: { blockSize: number; blocksPerRow: number; blockGutter: number }) {
        this.blockSize = param.blockSize;
        this.blocksPerRow = param.blocksPerRow;
        this.blockGutter = param.blockGutter;
    }

}

describe('MoneyDestination', () => {
    it('can be initialized', () => {
        const moneyStash = new MoneyDestination('Stash', 50);
        expect(moneyStash).toBeDefined()
    });
    it('gets a name and amount after initialization', () => {
        const moneyStash = new MoneyDestination('Stash', 50);
        const expected = {
            name: 'Stash',
            amount: 50,
        }
        const actual = {
            name: moneyStash.name,
            amount: moneyStash.amount
        }
        expect(actual).toEqual(expected)
    });
    it('has a default MoneyDestinationConfig', () => {
        const moneyStash = new MoneyDestination('Stash', 50);
        const expected = new MoneyDestinationConfig({
            blockSize: 10,
            blocksPerRow: 10,
            blockGutter: 2,
        })
        expect(moneyStash.config).toEqual(expected)
    });
})