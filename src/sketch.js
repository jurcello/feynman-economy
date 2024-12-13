import p5 from "p5";

const sketch = (p) => {
    let canvas;

    p.setup = () => {
        canvas = p.createCanvas(400, 400);

        // Attach the canvas to a container (use `#p5-container`)
        canvas.parent("p5-container");

        p.background(220);
    };

    p.draw = () => {
        p.fill(100);
        p.ellipse(p.mouseX, p.mouseY, 50, 50);
    };
};

// Initialize p5 instance
new p5(sketch);