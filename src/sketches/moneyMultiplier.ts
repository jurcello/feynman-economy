import p5 from "p5";

const createSketch = (canvasContainer: HTMLDivElement) => (p: p5) => {
    let canvas;

    const height = 500;
    p.setup = () => {
        canvas = p.createCanvas(800, height);

        canvas.parent(canvasContainer);
        p.background(220);
    }

    p.draw = () => {
        p.background(220);
        p.circle(p.mouseX, p.mouseY, 100);
    };
};

export default createSketch;