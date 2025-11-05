import {describe, expect, it, vi} from "vitest";
import {
    MoneyDestination,
    MoneyDestinationConfig,
    MoneyBlock,
    Position,
    MoneyWorld,
    UniverseId
} from "@/utils/moneySquareUtils";

const universe: UniverseId = 'uni1';

describe('MoneyDestination', () => {
    it('can be initialized', () => {
        const moneyStash = new MoneyDestination('Stash', 50, universe);
        expect(moneyStash).toBeDefined()
    });
    it('gets a name and amount after initialization', () => {
        const moneyStash = new MoneyDestination('Stash', 50, universe);
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
        const moneyStash = new MoneyDestination('Stash', 50, universe);
        const expected = new MoneyDestinationConfig({
            blockSize: 10,
            blocksPerRow: 10,
            blockGutter: 2,
        })
        expect(moneyStash.config).toEqual(expected)
    });
    it('has 10 blocks created when it is initialized with an amount of 10', () => {
        const moneyStash = new MoneyDestination('Stash', 10, universe);

        expect(moneyStash.blocks.length).toBe(10);
    });

    it('creates blocks that are instances of MoneyBlock which contain their position', () => {
        const config = new MoneyDestinationConfig({blockSize: 10, blocksPerRow: 2, blockGutter: 2});
        const moneyStash = new MoneyDestination('Stash', 4, universe, config)

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
        const moneyStash = new MoneyDestination('Stash', 4, universe, config);

        const actual = moneyStash.blocks.map(block => block.blockSize);
        const expected = Array(4).fill(15);
        expect(actual).toEqual(expected);
    });


    it('creates blocks with correct positions when MoneyDestination has a position', () => {
        const position: Position = {x: 10, y: 80};
        const config = new MoneyDestinationConfig({blockSize: 10, blocksPerRow: 2, blockGutter: 2, position});
        const moneyStash = new MoneyDestination('Stash', 4, universe, config)

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
        const moneyStash = new MoneyDestination('Stash', 4, universe, config);

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
        const source = new MoneyDestination('Source', 10, universe);
        const destination = new MoneyDestination('Destination', 5, universe);
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

        const source = new MoneyDestination('Source', 1, universe, sourceConfig);
        const destination = new MoneyDestination('Destination', 0, universe, destinationConfig);

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
        MoneyBlock.getBlockArray(universe).length = 0;

        const source = new MoneyDestination('Source', 3, universe);
        const destination = new MoneyDestination('Destination', 2, universe);

        source.moveTo(destination, 1);

        // The total number of blocks should remain the same after moving
        expect(MoneyBlock.getBlockArray(universe).length).toBe(5);
    });


    it('preserves block id when moved to another destination', () => {
        const source = new MoneyDestination('Source', 1, universe);
        const destination = new MoneyDestination('Destination', 0, universe);
        const originalId = source.blocks[0].id;

        source.moveTo(destination, 1);

        expect(destination.blocks[0].id).toBe(originalId);
    });

    it('destroys all blocks in a destination when destroyAllBlocks is called', () => {
        const destination = new MoneyDestination('Destination', 5, universe);

        destination.destroyAllBlocks();
        const expected = {blocks: 0, amount: 0};
        const actual = {blocks: destination.blocks.length, amount: destination.amount};
        expect(actual).toEqual(expected);
    });

    it('destroys blocks in a destination when destroyBlocks is called', () => {
        const destination = new MoneyDestination('Destination', 5, universe);

        destination.destroyBlocks(4);
        const expected = {blocks: 1, amount: 1};
        const actual = {blocks: destination.blocks.length, amount: destination.amount};
        expect(actual).toEqual(expected);
    });

    it('destinations belonging to different universes add their blocks to the right universe', () => {
        const universe1: UniverseId = 'uni1';
        const universe2: UniverseId = 'uni2';

        const destination1 = new MoneyDestination('Destination1', 5, universe1);
        const destination2 = new MoneyDestination('Destination2', 5, universe2);

        destination2.addMoney(10);

        const expected = {
            universe1Blocks: 5,
            universe2Blocks: 15,
        }
        const actual = {
            universe1Blocks: MoneyBlock.getBlockArray(universe1).length,
            universe2Blocks: MoneyBlock.getBlockArray(universe2).length,
        }
    });

})
