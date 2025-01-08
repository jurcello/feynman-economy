import p5 from "p5";
import gsap from "gsap";

import moneyIMage from "@/assets/images/money.png";

class Money {
    private p: p5;
    public position: { x: number; y: number } = { x: 0, y: 0 };
    private image: p5.Image;
    private width: number = 70;

    constructor(p: p5, x: number, y: number) {
        this.p = p;
        this.position.x = x - this.width / 2;
        this.position.y = y - this.width / 2;
        this.image = p.loadImage(moneyIMage, () => {
            this.image.resize(this.width, 0);
        });
    }

    draw() {
        this.p.image(this.image, this.position.x, this.position.y);
    }

    moveTo(x: number, y: number) {
        gsap.to(this.position, {
            x: this.p.mouseX - this.width / 2,
            y: this.p.mouseY - this.width / 2,
            duration: 1,
            ease: "power2.inOut",
        })
    }
}
const createSketch = (canvasContainer: HTMLDivElement) => (p: p5) => {
    let canvas;

    const money = new Money(p, 50, 50);

    const height = 500;
    p.setup = () => {
        canvas = p.createCanvas(800, height);

        canvas.parent(canvasContainer);
        p.background(220);
    }

    p.draw = () => {
        p.background(220);
        money.draw();

    };

    p.mousePressed = () => {
        money.moveTo(p.mouseX, p.mouseY);
    }
};

export default createSketch;