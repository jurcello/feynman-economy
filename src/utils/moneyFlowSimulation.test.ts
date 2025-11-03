import {describe, expect, it, vi} from "vitest";
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
    it('can create a list of functions corresponding to the flow', () => {
        const moneyFlowSimulation = new MoneyFlowSimulation();
        const input = new Input(10);

        moneyFlowSimulation.addInput(input)

        const moneyDestination = new MoneyDestination('Stash', 0);
        const moneyDestination2 = new MoneyDestination('Stash2', 0);
        const connection = new Connection({from: input, to: moneyDestination});
        const connection2 = new Connection({from: moneyDestination, to: moneyDestination2});
        moneyFlowSimulation.addConnection(connection)
        moneyFlowSimulation.addConnection(connection2)

        const generatedFunctions = moneyFlowSimulation.loop(1);

        for (const func of generatedFunctions) {
            func();
        };

        expect(moneyDestination.amount).toEqual(0);
        expect(moneyDestination2.amount).toEqual(10);
    });
})