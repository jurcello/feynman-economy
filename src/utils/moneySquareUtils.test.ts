import {describe, expect, it} from "vitest";

interface Position {
    x: number;
    y: number;
}

class MoneyBlock {
    public currentPosition: Position;
    public targetPosition: Position;
    public isMoving: boolean = false;
    public static allBlocks: MoneyBlock[] = [];

    constructor(params: { currentPosition: Position; targetPosition: Position }) {
        this.currentPosition = params.currentPosition;
        this.targetPosition = params.targetPosition;
        MoneyBlock.allBlocks.push(this);
    }

    public destroy(): void {
        const index = MoneyBlock.allBlocks.indexOf(this);
        if (index !== -1) {
            MoneyBlock.allBlocks.splice(index, 1);
        }
    }
}


class MoneyDestinationConfig {
    public blockSize: number;
    public blocksPerRow: number;
    public blockGutter: number;
    public position: Position;

    constructor(param: { blockSize: number; blocksPerRow: number; blockGutter: number; position?: Position }) {
        this.blockSize = param.blockSize;
        this.blocksPerRow = param.blocksPerRow;
        this.blockGutter = param.blockGutter;
        this.position = param.position || { x: 0, y: 0 };
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
            blocks.push(this.createBlockAtIndex(i));
        }

        return blocks;
    }

    private createBlockAtIndex(index: number): MoneyBlock {
        const { row, col } = this.getGridPosition(index);
        const position = this.calculatePosition(row, col);

        return new MoneyBlock({
            currentPosition: position,
            targetPosition: { x: 0, y: 0 }
        });
    }

    private getGridPosition(index: number): { row: number; col: number } {
        const row = Math.floor(index / this.config.blocksPerRow);
        const col = index % this.config.blocksPerRow;
        return { row, col };
    }

    private calculatePosition(row: number, col: number): Position {
        const x = this.config.position.x + col * (this.config.blockSize + this.config.blockGutter);
        const y = this.config.position.y + (row === 0 ? 0 : -row * (this.config.blockSize + this.config.blockGutter));
        return { x, y };
    }

    public addMoney(amount: number): void {
        for (let i = 0; i < amount; i++) {
            const newBlock = this.createBlockAtIndex(this.amount + i);
            this.blocks.push(newBlock);
        }
        this.amount += amount;
    }

    public addBlocks(blocks: MoneyBlock[]): void {
        for (const block of blocks) {
            const newIndex = this.blocks.length;
            const { row, col } = this.getGridPosition(newIndex);
            const newPosition = this.calculatePosition(row, col);

            // Update the block's target position to its new position in this destination
            block.targetPosition = newPosition;
            block.isMoving = true;
            this.blocks.push(block);
        }
        this.amount += blocks.length;
    }


    public moveTo(destination: MoneyDestination, amount: number): void {
        if (amount > this.amount) {
            throw new Error('Cannot move more money than available');
        }

        // Remove blocks from source (from the end)
        const movedBlocks = this.blocks.splice(-amount, amount);
        this.amount -= amount;

        // Add the actual blocks to destination
        destination.addBlocks(movedBlocks);
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

    it('creates blocks with correct positions when MoneyDestination has a position', () => {
        const position: Position = {x: 10, y: 80};
        const config = new MoneyDestinationConfig({blockSize: 10, blocksPerRow: 2, blockGutter: 2, position});
        const moneyStash = new MoneyDestination('Stash', 4, config)

        const expectedFirstMoneyBlocks = [
            new MoneyBlock({currentPosition: {x: 10, y: 80}, targetPosition: {x: 0, y: 0}}),
            new MoneyBlock({currentPosition: {x: 22, y: 80}, targetPosition: {x: 0, y: 0}}),
            new MoneyBlock({currentPosition: {x: 10, y: 68}, targetPosition: {x: 0, y: 0}}),
            new MoneyBlock({currentPosition: {x: 22, y: 68}, targetPosition: {x: 0, y: 0}}),
        ];

        expect(moneyStash.blocks).toEqual(expectedFirstMoneyBlocks);
    });

    it('adds one block with correct position when addMoney is called', () => {
        const position: Position = {x: 10, y: 80};
        const config = new MoneyDestinationConfig({blockSize: 10, blocksPerRow: 2, blockGutter: 2, position});
        const moneyStash = new MoneyDestination('Stash', 4, config);

        moneyStash.addMoney(1);

        const expectedNewBlock = new MoneyBlock({
            currentPosition: {x: 10, y: 56},
            targetPosition: {x: 0, y: 0}
        });

        expect(moneyStash.blocks.length).toBe(5);
        expect(moneyStash.blocks[4]).toEqual(expectedNewBlock);
    });

    it('can move an amount of money from one destination to another destination using the move to function', () => {
        const source = new MoneyDestination('Source', 10);
        const destination = new MoneyDestination('Destination', 5);
        const amountToMove = 3;

        // Test will fail as the moveTo function is not implemented yet
        source.moveTo(destination, amountToMove);

        expect({
            sourceBlocks: source.blocks.length,
            sourceAmount: source.amount,
            destinationBlocks: destination.blocks.length,
            destinationAmount: destination.amount
        }).toEqual({
            sourceBlocks: 7,
            sourceAmount: 7,
            destinationBlocks: 8,
            destinationAmount: 8
        });
    });

    it('correctly updates block position when moved to another destination', () => {
        const sourceConfig = new MoneyDestinationConfig({
            blockSize: 10,
            blocksPerRow: 2,
            blockGutter: 2,
            position: {x: 0, y: 0}
        });
        const destinationConfig = new MoneyDestinationConfig({
            blockSize: 10,
            blocksPerRow: 2,
            blockGutter: 2,
            position: {x: 100, y: 100}
        });

        const source = new MoneyDestination('Source', 1, sourceConfig);
        const destination = new MoneyDestination('Destination', 0, destinationConfig);

        source.moveTo(destination, 1);

        const movedBlock = destination.blocks[0];
        expect({
            currentPosition: movedBlock.currentPosition,
            targetPosition: movedBlock.targetPosition
        }).toEqual({
            currentPosition: {x: 0, y: 0},
            targetPosition: {x: 100, y: 100}
        });
    });

    it('keeps track of all blocks in the system through MoneyBlock.allBlocks', () => {
        MoneyBlock.allBlocks.length = 0;

        const source = new MoneyDestination('Source', 3);
        const destination = new MoneyDestination('Destination', 2);

        source.moveTo(destination, 1);

        // The total number of blocks should remain the same after moving
        expect(MoneyBlock.allBlocks.length).toBe(5);
    });

    it('sets isMoving to true when a block is moved to another destination', () => {
        const source = new MoneyDestination('Source', 1);
        const destination = new MoneyDestination('Destination', 0);

        source.moveTo(destination, 1);

        expect(destination.blocks[0].isMoving).toBe(true);
    });


})