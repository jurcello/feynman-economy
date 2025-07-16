export type Position = {
    x: number;
    y: number;
}

export type MoneyBlockListener = (blocks: MoneyBlock[]) => void;

class MoneyBlock {
    private _currentPosition: Position;
    private _targetPosition: Position;
    private _isMoving: boolean = false;
    public static allBlocks: MoneyBlock[] = [];
    private static listeners: MoneyBlockListener[] = [];
    public id: string = `block-${Date.now()}-${Math.random()}`;

    get currentPosition(): Position {
        return this._currentPosition;
    }

    set currentPosition(value: Position) {
        this._currentPosition = value;
        MoneyBlock.notifyListeners(MoneyBlock.allBlocks);
    }

    get targetPosition(): Position {
        return this._targetPosition;
    }

    set targetPosition(value: Position) {
        this._targetPosition = value;
        MoneyBlock.notifyListeners(MoneyBlock.allBlocks);
    }

    get isMoving(): boolean {
        return this._isMoving;
    }

    set isMoving(value: boolean) {
        this._isMoving = value;
        MoneyBlock.notifyListeners(MoneyBlock.allBlocks);
    }

    constructor(params: { currentPosition: Position; targetPosition: Position }) {
        this._currentPosition = params.currentPosition;
        this._targetPosition = params.targetPosition;

        MoneyBlock.allBlocks.push(this);
        MoneyBlock.notifyListeners(MoneyBlock.allBlocks);
    }

    public destroy(): void {
        const index = MoneyBlock.allBlocks.indexOf(this);
        if (index !== -1) {
            MoneyBlock.allBlocks.splice(index, 1);
        }
    }

    public static updateMovingBlocks(): void {
        MoneyBlock.allBlocks.forEach(block => {
            if (block.isMoving) {
                block.currentPosition = block.targetPosition;
                block.targetPosition = {x: 0, y: 0};
                block.isMoving = false;
            }
        });
    }

    public static addListener(listener: MoneyBlockListener): void {
        this.listeners.push(listener);
        this.notifyListeners(MoneyBlock.allBlocks);
    }

    public static removeListener(listener: MoneyBlockListener): void {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }

    public static notifyListeners(blocks: MoneyBlock[]): void {
        this.listeners.forEach(listener => listener(blocks));
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

class MoneyWorld {
    public moneyDestinations: MoneyDestination[];
    private listeners: MoneyBlockListener[] = [];

    constructor(moneyDestinations: MoneyDestination[]) {
        this.moneyDestinations = moneyDestinations;
        MoneyBlock.addListener(this.notifyListeners.bind(this));
    }

    public addListener(listener: MoneyBlockListener): void {
        this.listeners.push(listener);
        this.notifyListeners(MoneyBlock.allBlocks);
    }

    public removeListener(listener: MoneyBlockListener): void {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }

    public notifyListeners(blocks: MoneyBlock[]): void {
        this.listeners.forEach(listener => listener(blocks));
    }
}

export {MoneyBlock, MoneyDestination, MoneyDestinationConfig, MoneyWorld};