export type Position = {
    x: number;
    y: number;
}

export type MoneyBlockListener = (blocks: MoneyBlock[]) => void;

class MoneyBlock {
    private _position: Position;
    public static allBlocks: MoneyBlock[] = [];
    public id: string = `block-${Date.now()}-${Math.random()}`;
    private _blockSize: number = 10;

    get blockSize(): number {
        return this._blockSize;
    }

    set blockSize(value: number) {
        this._blockSize = value;
    }

    get position(): Position {
        return this._position;
    }

    set position(value: Position) {
        this._position = value;
    }

    constructor(params: { position: Position; blockSize?: number }) {
        this._position = params.position;
        this._blockSize = params.blockSize || 10;

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
            position,
            blockSize: this.config.blockSize,
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

            // Update the block's position to its new position in this destination
            block.position = newPosition;
            block.blockSize = this.config.blockSize;
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

    destroyAllBlocks() {
        this.destroyBlocks(this.blocks.length);
    }

    destroyBlocks(number: number) {
        const lastIndex = this.blocks.length - number;
        for (let i = this.blocks.length - 1; i >= lastIndex; i--) {
            const block = this.blocks[i];
            this.blocks.splice(i, 1);
            this.amount--;
            block.destroy();
        }
    }
}

class MoneyWorld {
    public moneyDestinations: MoneyDestination[];
    private listeners: MoneyBlockListener[] = [];

    constructor(moneyDestinations: MoneyDestination[]) {
        this.moneyDestinations = moneyDestinations;
    }
}

export {MoneyBlock, MoneyDestination, MoneyDestinationConfig, MoneyWorld};