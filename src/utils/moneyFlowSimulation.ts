import {MoneyDestination} from "@/utils/moneySquareUtils";

export class MoneyFlowSimulation {
    private _inputs: Input[] = [];
    private _connections: Connection[] = [];

    public addInput(input: Input) {
        this._inputs.push(input);
    }

    public addConnection(connection: Connection) {
        this._connections.push(connection);
    }

    public get inputs(): Input[] {
        return this._inputs;
    }

    public get connections(): Connection[] {
        return this._connections;
    }

    public loop(iterations: number): Array<() => void> {
        const functions: (() => void)[] = [];
        while (iterations > 0) {
            this._inputs.forEach(input => {
                functions.push(...this.traverseForSource(input));
            })
            iterations--;
        }
        return functions;
    }

    private traverseForSource(source: Input|MoneyDestination): Array<() => void> {
        const functions: (() => void)[] = [];
        const filteredConnections = this.connections.filter(connection => connection.from === source);
        filteredConnections.forEach(connection => {
            const func = connection.apply();
            functions.push(func)
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
    private _to: MoneyDestination;

    constructor(params: { from: Input|MoneyDestination; to: MoneyDestination }) {
        this._from = params.from;
        this._to = params.to;
    }

    public get from(): Input|MoneyDestination {
        return this._from;
    }

    public get to(): MoneyDestination {
        return this._to;
    }

    public apply(): () => void {
        if (this._from instanceof Input) {
            return () => {
                this._to.addMoney(this._from.amount);
            }
        }
        return () => {
            (this._from as MoneyDestination).moveTo(this._to, this._from.amount);
        }
    }
}