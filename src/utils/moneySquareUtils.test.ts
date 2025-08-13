import {describe, expect, it, vi} from "vitest";
import {MoneyDestination, MoneyDestinationConfig, MoneyBlock, Position, MoneyWorld} from "@/utils/moneySquareUtils";

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

    it('creates blocks that are instances of MoneyBlock which contain their position', () => {
        const config = new MoneyDestinationConfig({blockSize: 10, blocksPerRow: 2, blockGutter: 2});
        const moneyStash = new MoneyDestination('Stash', 4, config)

        const actualPositions = moneyStash.blocks.map(block => ({
            position: block.position,
        }));

        const expectedPositions = [
            {position: {x: 0, y: 0}},
            {position: {x: 12, y: 0}},
            {position: {x: 0, y: -12}},
            {position: {x: 12, y: -12}}
        ];

        expect(expectedPositions).toEqual(actualPositions);
    });

    it('creates blocks with blockSize matching the config', () => {
        const config = new MoneyDestinationConfig({blockSize: 15, blocksPerRow: 2, blockGutter: 2});
        const moneyStash = new MoneyDestination('Stash', 4, config);

        const actual = moneyStash.blocks.map(block => block.blockSize);
        const expected = Array(4).fill(15);
        expect(actual).toEqual(expected);
    });


    it('creates blocks with correct positions when MoneyDestination has a position', () => {
        const position: Position = {x: 10, y: 80};
        const config = new MoneyDestinationConfig({blockSize: 10, blocksPerRow: 2, blockGutter: 2, position});
        const moneyStash = new MoneyDestination('Stash', 4, config)

        const actualPositions = moneyStash.blocks.map(block => ({
            position: block.position,
        }));

        const expectedPositions = [
            {position: {x: 10, y: 80}},
            {position: {x: 22, y: 80}},
            {position: {x: 10, y: 68}},
            {position: {x: 22, y: 68}}
        ];

        expect(expectedPositions).toEqual(actualPositions);
    });

    it('adds one block with correct position when addMoney is called', () => {
        const position: Position = {x: 10, y: 80};
        const config = new MoneyDestinationConfig({blockSize: 10, blocksPerRow: 2, blockGutter: 2, position});
        const moneyStash = new MoneyDestination('Stash', 4, config);

        moneyStash.addMoney(1);

        const expectedNewBlock = {
            position: {x: 10, y: 56},
        };

        expect(moneyStash.blocks.length).toBe(5);
        const lastBlockPositions = {
            position: moneyStash.blocks[4].position,
        };
        expect(lastBlockPositions).toEqual(expectedNewBlock);
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
            blockSize: 15,
            blocksPerRow: 2,
            blockGutter: 2,
            position: {x: 100, y: 100}
        });

        const source = new MoneyDestination('Source', 1, sourceConfig);
        const destination = new MoneyDestination('Destination', 0, destinationConfig);

        source.moveTo(destination, 1);

        const movedBlock = destination.blocks[0];
        expect({
            position: movedBlock.position,
            blockSize: movedBlock.blockSize,
        }).toEqual({
            position: {x: 100, y: 100},
            blockSize: 15,
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


    it('preserves block id when moved to another destination', () => {
        const source = new MoneyDestination('Source', 1);
        const destination = new MoneyDestination('Destination', 0);
        const originalId = source.blocks[0].id;

        source.moveTo(destination, 1);

        expect(destination.blocks[0].id).toBe(originalId);
    });

    it('destroys all blocks in a destination when destroyAllBlocks is called', () => {
        const destination = new MoneyDestination('Destination', 5);

        destination.destroyAllBlocks();
        const expected = {blocks: 0, amount: 0};
        const actual = {blocks: destination.blocks.length, amount: destination.amount};
        expect(actual).toEqual(expected);
    });

    it('destroys blocks in a destination when destroyBlocks is called', () => {
        const destination = new MoneyDestination('Destination', 5);

        destination.destroyBlocks(4);
        const expected = {blocks: 1, amount: 1};
        const actual = {blocks: destination.blocks.length, amount: destination.amount};
        expect(actual).toEqual(expected);
    });

})

describe('The money world', () => {
    it('tracks changes immediately when created', () => {
        const destination = new MoneyDestination('Destination', 2);
        const moneyWorld = new MoneyWorld([destination]);

        const spy = vi.fn();
        moneyWorld.addListener(spy);

        expect(spy).toHaveBeenCalledWith(MoneyBlock.allBlocks);
    });

    it('calls the listener when money is added', () => {
        const destination = new MoneyDestination('Destination', 2);
        const moneyWorld = new MoneyWorld([destination]);

        const spy = vi.fn();
        moneyWorld.addListener(spy);
        spy.mockClear();
        destination.addMoney(1);

        expect(spy).toHaveBeenCalledWith(MoneyBlock.allBlocks);
    });

    it('calls the listener when money is moved', () => {
        const source = new MoneyDestination('Source', 2);
        const destination = new MoneyDestination('Destination', 0);
        const moneyWorld = new MoneyWorld([source, destination]);

        const spy = vi.fn();
        moneyWorld.addListener(spy);
        spy.mockClear();
        source.moveTo(destination, 1);

        expect(spy).toHaveBeenCalledWith(MoneyBlock.allBlocks);
    })


});