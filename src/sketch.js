import p5 from "p5";

const sketch = (p) => {
    p.setup = () => {
        p.createCanvas(400, 400);
        p.background(220);
    };

    p.draw = () => {
        p.ellipse(p.mouseX, p.mouseY, 10, 10);
    };
};

// Initialize the p5 instance
new p5(sketch);