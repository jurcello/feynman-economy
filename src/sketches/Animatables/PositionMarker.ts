class PositionMarker {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(x: number, y: number) {
        return new PositionMarker(this.x + x, this.y + y);
    }
}

export default PositionMarker;