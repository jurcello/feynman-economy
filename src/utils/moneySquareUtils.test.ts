import {describe, expect, it} from "vitest";

interface Position {
    x: number;
    y: number;
}

class MoneyBlock {
    public currentPosition: Position;
    public targetPosition: Position;

    constructor(params: { currentPosition: Position; targetPosition: Position }) {
        this.currentPosition = params.currentPosition;
        this.targetPosition = params.targetPosition;
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

class MoneyDestination {
    public config: MoneyDestinationConfig;
    public blocks: MoneyBlock[];

    constructor(
        public name: string,
        public amount: number,
        config?: MoneyDestinationConfig
    ) {
        this.config = config || new MoneyDestinationConfig({
            blockSize: 10,
            blocksPerRow: 10,
            blockGutter: 2,
        });
        this.blocks = this.createBlocks();
    }

    private createBlocks(): MoneyBlock[] {
        const blocks: MoneyBlock[] = [];

        for (let i = 0; i < this.amount; i++) {
            const row = Math.floor(i / this.config.blocksPerRow);
            const col = i % this.config.blocksPerRow;

            const x = col * (this.config.blockSize + this.config.blockGutter);
            const y = row === 0 ? 0 : -row * (this.config.blockSize + this.config.blockGutter);


            blocks.push(new MoneyBlock({
                currentPosition: { x, y },
                targetPosition: { x: 0, y: 0 }
            }));
        }

        return blocks;
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
    it('has 10 blocks created when it is initialized with an amount of 10', () => {
        const moneyStash = new MoneyDestination('Stash', 10);

        expect(moneyStash.blocks.length).toBe(10);
    });

    it('creates blocks that are instances of MoneyBlock which contains the current and new position', () => {
        const config = new MoneyDestinationConfig({blockSize: 10, blocksPerRow: 2, blockGutter: 2});
        const moneyStash = new MoneyDestination('Stash', 4, config)

        const expectedFirstMoneyBlocks = [
            new MoneyBlock({ currentPosition: {x: 0, y: 0}, targetPosition: {x: 0, y: 0} }),
            new MoneyBlock({ currentPosition: {x: 12, y: 0}, targetPosition: {x: 0, y: 0} }),
            new MoneyBlock({ currentPosition: {x: 0, y: -12}, targetPosition: {x: 0, y: 0} }),
            new MoneyBlock({ currentPosition: {x: 12, y: -12}, targetPosition: {x: 0, y: 0} }),
        ];

        expect(moneyStash.blocks).toEqual(expectedFirstMoneyBlocks);
    });
})