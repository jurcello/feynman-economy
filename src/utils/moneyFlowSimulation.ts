import {MoneyDestination} from "@/utils/moneySquareUtils";
import gsap from "gsap";

type Timeline = gsap.core.Timeline;

type FunctionInfo = {
    function: () => void,
    delay: number
}

export type FlowFunctionInsert = {
    function: () => void,
    atLoop: number,
    newAnimationTime?: number
}

export class MoneyFlowSimulation {
    private _inputs: Input[] = [];
    private _connections: Connection[] = [];
    private _redrawFunction?: () => void;
    private _flowAnimationDuration: number = 400;
    private _currentAmimationDuration: number = 400;
    private _flowFunctionInserts: FlowFunctionInsert[] = [];
    private _flowFunctionInsertIndex: number = 0;

    public addInput(input: Input): MoneyFlowSimulation {
        this._inputs.push(input);
        return this;
    }

    public addConnection(connection: Connection): MoneyFlowSimulation {
        this._connections.push(connection);
        return this;
    }

    public addFlowFunctionInsert(flowFunctionInsert: FlowFunctionInsert): MoneyFlowSimulation {
        this._flowFunctionInserts.push(flowFunctionInsert);
        this._flowFunctionInserts.sort((a, b) => a.atLoop - b.atLoop);
        return this;
    }

    public setAnimationDuration(flowDuration: number): MoneyFlowSimulation {
        this._flowAnimationDuration = flowDuration;
        this._currentAmimationDuration = flowDuration;
        return this;
    }

    public get inputs(): Input[] {
        return this._inputs;
    }

    public get connections(): Connection[] {
        return this._connections;
    }

    public addRedrawFunction(redrawFunction: () => void): MoneyFlowSimulation {
        this._redrawFunction = redrawFunction;
        return this;
    }

    public loop(iterations: number): Array<() => void> {
        const functionInfo = this.buildFunctionInfo(iterations);
        return functionInfo.map(info => info.function);
    }

    public generateTimeline(iterations: number): Timeline {
        const tl = gsap.timeline();
        const functionInfo = this.buildFunctionInfo(iterations);
        const firstFunction = functionInfo.shift();
        tl.add(firstFunction!.function, 0)
        functionInfo.forEach(info => {
            const position = `<${info.delay / 1000}`;
            tl.add(info.function, position)
        });

        return tl;
    }

    private buildFunctionInfo(iterations: number) {
        this._currentAmimationDuration = this._flowAnimationDuration;
        const functions: Array<FunctionInfo> = [];
        for (let i = 0; i < iterations; i++) {
            // Get all functions that should be inserted at this loop
            while (
                this._flowFunctionInserts.length > this._flowFunctionInsertIndex
                && this._flowFunctionInserts[this._flowFunctionInsertIndex].atLoop === i
                ) {
                const flowFunctionInsert = this._flowFunctionInserts[this._flowFunctionInsertIndex];
                functions.push({
                    function: flowFunctionInsert.function,
                    delay: 20,
                });
                if (flowFunctionInsert.newAnimationTime) {
                    this._currentAmimationDuration = flowFunctionInsert.newAnimationTime;
                }
                this._flowFunctionInsertIndex++;
            }
            this._inputs.forEach(input => {
                functions.push(...this.traverseForSource(input));
            })
        }
        return functions;
    }

    private traverseForSource(source: Input|MoneyDestination): Array<FunctionInfo> {
        const functions: Array<FunctionInfo> = [];
        const filteredConnections = this.connections.filter(connection => connection.from === source);
        let initialAmount = 0;
        filteredConnections.forEach((connection: Connection, index:number) => {
            const moveFunction = () => {
                if (index === 0) {
                    initialAmount = source.amount;
                }
                connection.applyWithInitial(initialAmount)
                this._redrawFunction?.();
            };
            functions.push({
                function: moveFunction,
                delay: this._currentAmimationDuration,
            })
        })
        filteredConnections.forEach(connection => {
            functions.push(...this.traverseForSource(connection.to))
        })
        return functions;
    }
}

export class Input {
    private _amount: number;

    constructor(amount: number) {
        this._amount = amount;
    }

    public get amount(): number {
        return this._amount;
    }
}

export class Connection {
    private _from: Input|MoneyDestination;
    private _fraction: number;
    private _to: MoneyDestination;

    constructor(params: {
        from: Input | MoneyDestination;
        to: MoneyDestination;
        fraction?: number;
    }) {
        this._from = params.from;
        this._to = params.to;
        this._fraction = params.fraction ?? 1;
    }

    public get fraction(): number {
        return this._fraction;
    }

    public get from(): Input|MoneyDestination {
        return this._from;
    }

    public get to(): MoneyDestination {
        return this._to;
    }

    public applyWithInitial(initialAmount: number):  void {
        if (this._from instanceof Input) {
            this._to.addMoney(initialAmount * this._fraction);
            return;
        }
        (this._from as MoneyDestination).moveTo(this._to, initialAmount * this._fraction);
    }
}