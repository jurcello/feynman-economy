import {describe, expect, it, vi, test} from "vitest";
import {MoneyFlowSimulation, Input, Connection} from "@/utils/moneyFlowSimulation";
import {MoneyDestination} from "@/utils/moneySquareUtils";

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

        const moneyDestination = new MoneyDestination('Stash', 0);
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

        const moneyDestination = new MoneyDestination('Stash', 0);
        const moneyDestination2 = new MoneyDestination('Stash2', 0);
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

        const moneyDestination = new MoneyDestination('Stash', 0);
        const moneyDestination2 = new MoneyDestination('Stash2', 0);
        const moneyDestination3 = new MoneyDestination('Stash3', 0);
        const connection = new Connection({from: input, to: moneyDestination});
        const connection2 = new Connection({from: moneyDestination, to: moneyDestination2, fraction:0.7});
        const connection3 = new Connection({from: moneyDestination, to: moneyDestination3, fraction:0.3});
        moneyFlowSimulation.addConnection(connection)
        moneyFlowSimulation.addConnection(connection2)
        moneyFlowSimulation.addConnection(connection3)

        const generatedFunctions = moneyFlowSimulation.loop(1);

        for (const func of generatedFunctions) {
            func();
        };

        const expectedValues = {stash2: 7, stash3: 3};
        expect({stash2: moneyDestination2.amount, stash3: moneyDestination3.amount}).toEqual(expectedValues);
    })
})