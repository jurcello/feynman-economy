import {describe, expect, it, vi, test} from "vitest";
import {MoneyFlowSimulation, Input, Connection} from "@/utils/moneyFlowSimulation";
import {MoneyDestination} from "@/utils/moneySquareUtils";

const universe = 'uni1';

describe('moneyFlowSimulation', () => {
    it('can be initialized', () => {
        const moneyFlowSimulation = new MoneyFlowSimulation();
        expect(moneyFlowSimulation).toBeDefined();
    })

    it('can have an input', () => {
        const moneyFlowSimulation = new MoneyFlowSimulation();
        const input = new Input(10);

        moneyFlowSimulation.addInput(input);

        expect(moneyFlowSimulation.inputs[0]).toBe(input);
    });
    it('can have a connection between an input and a MoneyDestination', () => {
        const moneyFlowSimulation = new MoneyFlowSimulation();
        const input = new Input(10);

        moneyFlowSimulation.addInput(input)

        const moneyDestination = new MoneyDestination('Stash', 0, universe);
        const connection = new Connection({from: input, to: moneyDestination});
        moneyFlowSimulation.addConnection(connection)

        expect(moneyFlowSimulation.connections[0]).toBe(connection);
    });
    test.each([
        { loops: 1, expectedStash: 0, expectedStash2: 10 },
        { loops: 2, expectedStash: 0, expectedStash2: 20 },
        { loops: 3, expectedStash: 0, expectedStash2: 30 },
        { loops: 5, expectedStash: 0, expectedStash2: 50 },
    ])('can create a list of functions corresponding to the flow with $loops loops', ({ loops, expectedStash, expectedStash2 }) => {
        const moneyFlowSimulation = new MoneyFlowSimulation();
        const input = new Input(10);

        moneyFlowSimulation.addInput(input)

        const moneyDestination = new MoneyDestination('Stash', 0, universe);
        const moneyDestination2 = new MoneyDestination('Stash2', 0, universe);
        const connection = new Connection({from: input, to: moneyDestination});
        const connection2 = new Connection({from: moneyDestination, to: moneyDestination2});
        moneyFlowSimulation.addConnection(connection)
        moneyFlowSimulation.addConnection(connection2)

        const generatedFunctions = moneyFlowSimulation.loop(loops);

        for (const func of generatedFunctions) {
            func();
        };

        expect(moneyDestination.amount).toEqual(expectedStash);
        expect(moneyDestination2.amount).toEqual(expectedStash2);
    });

    it('can have fractional connections', () => {
        const moneyFlowSimulation = new MoneyFlowSimulation();
        const input = new Input(10);

        moneyFlowSimulation.addInput(input)

        const moneyDestination = new MoneyDestination('Stash', 0, universe);
        const moneyDestination2 = new MoneyDestination('Stash2', 0, universe);
        const moneyDestination3 = new MoneyDestination('Stash3', 0, universe);
        const connection = new Connection({from: input, to: moneyDestination});
        const connection2 = new Connection({from: moneyDestination, to: moneyDestination2, fraction:0.7});
        const connection3 = new Connection({from: moneyDestination, to: moneyDestination3, fraction:0.3});
        moneyFlowSimulation.addConnection(connection)
        moneyFlowSimulation.addConnection(connection2)
        moneyFlowSimulation.addConnection(connection3)

        const generatedFunctions = moneyFlowSimulation.loop(2);

        for (const func of generatedFunctions) {
            func();
        };

        const expectedValues = {
            stash: 0,
            stash2: 14,
            stash3: 6
        };
        expect({
            stash: moneyDestination.amount,
            stash2: moneyDestination2.amount,
            stash3: moneyDestination3.amount
        }).toEqual(expectedValues);
    })

    test.each([
        { fraction1: 0.7, fraction2: 0.3, inputAmount: 10, expectedStash1: 7, expectedStash2: 3,  },
        { fraction1: 0.7, fraction2: 0.3, inputAmount: 9, expectedStash1: 6, expectedStash2: 3,  },
        { fraction1: 0.7, fraction2: 0.3, inputAmount: 8, expectedStash1: 6, expectedStash2: 2,  },
    ])('can have fractional connections where rounding is ok for $fraction1, $fraction2, $inputAmount', ({fraction1, fraction2, inputAmount, expectedStash1, expectedStash2}) => {

        const moneyFlowSimulation = new MoneyFlowSimulation();
        const input = new Input(inputAmount);
        moneyFlowSimulation.addInput(input)
        const moneyDestination = new MoneyDestination('Stash', 0, universe);
        const moneyDestination2 = new MoneyDestination('Stash2', 0, universe);
        const moneyDestination3 = new MoneyDestination('Stash3', 0, universe);
        const connection = new Connection({from: input, to: moneyDestination});
        const connection2 = new Connection({from: moneyDestination, to: moneyDestination2, fraction: fraction1});
        const connection3 = new Connection({from: moneyDestination, to: moneyDestination3, fraction: fraction2});
        moneyFlowSimulation.addConnection(connection)
        moneyFlowSimulation.addConnection(connection2)
        moneyFlowSimulation.addConnection(connection3)

        const generatedFunctions = moneyFlowSimulation.loop(1);

        for (const func of generatedFunctions) {
            func();
        };

        const expectedValues = {
            stash: 0,
            stash2: expectedStash1,
            stash3: expectedStash2
        };
        expect({
            stash: moneyDestination.amount,
            stash2: moneyDestination2.amount,
            stash3: moneyDestination3.amount
        }).toEqual(expectedValues);
    })
    it('just handles the input flow amount for deeper connections', () => {
        const moneyFlowSimulation = new MoneyFlowSimulation();
        const input = new Input(100);

        moneyFlowSimulation.addInput(input)

        const moneyDestination = new MoneyDestination('Stash', 0, universe);
        const moneyDestination2 = new MoneyDestination('Stash2', 0, universe);
        const moneyDestination3 = new MoneyDestination('Stash3', 0, universe);
        const moneyDestination4 = new MoneyDestination('Stash4', 0, universe);
        const moneyDestination5 = new MoneyDestination('Stash5', 0, universe);
        const connection = new Connection({from: input, to: moneyDestination});
        const connection2 = new Connection({from: moneyDestination, to: moneyDestination2, fraction:0.6});
        const connection3 = new Connection({from: moneyDestination, to: moneyDestination3, fraction:0.4});
        const connection4 = new Connection({from: moneyDestination3, to: moneyDestination4, fraction:0.25});
        const connection5 = new Connection({from: moneyDestination3, to: moneyDestination5, fraction:0.75});
        moneyFlowSimulation.addConnection(connection)
        moneyFlowSimulation.addConnection(connection2)
        moneyFlowSimulation.addConnection(connection3)
        moneyFlowSimulation.addConnection(connection4)
        moneyFlowSimulation.addConnection(connection5)

        const generatedFunctions = moneyFlowSimulation.loop(1);

        for (const func of generatedFunctions) {
            func();
        };

        const expectedValues = {
            stash: 0,
            stash4: 10,
            stash5: 30
        };
        expect({
            stash: moneyDestination.amount,
            stash4: moneyDestination4.amount,
            stash5: moneyDestination5.amount
        }).toEqual(expectedValues);
    });

})