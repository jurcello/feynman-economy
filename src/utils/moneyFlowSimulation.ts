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
        let initialAmount = 0;
        filteredConnections.forEach((connection: Connection, index:number) => {
            functions.push(() => {
                if (index === 0) {
                    initialAmount = source.amount;
                }
                connection.applyWithInitial(initialAmount)
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