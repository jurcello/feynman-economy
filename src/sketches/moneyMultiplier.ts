import p5 from "p5";
import Timeline = gsap.core.Timeline;

import gsapinstance from "gsap";
import moneyIMage from "@/assets/images/money.png";

class Money {
    private p: p5;
    public position: { x: number; y: number } = {x: 0, y: 0};
    public properties: { opacity: number } = {opacity: 0};
    private image: p5.Image;
    private width: number = 70;
    private tl: Timeline;

    constructor(p: p5, x: number, y: number) {
        this.p = p;
        this.position.x = x - this.width / 2;
        this.position.y = y - this.width / 2;
        this.image = p.loadImage(moneyIMage, () => {
            this.image.resize(this.width, 0);
        });
        this.tl = gsapinstance.timeline();
    }

    draw() {
        if (this.properties.opacity > 0) {
            this.p.tint(255, 255, 255, this.properties.opacity * 255);
            this.p.image(this.image, this.position.x, this.position.y);
            this.p.tint(255, 255, 255, 255);
        }
    }

    moveTo(x: number, y: number) {
        const tl = gsapinstance.timeline();
        this.tl.to(this.position, {
            x: this.p.mouseX - this.width / 2,
            y: this.p.mouseY - this.width / 2,
            duration: 1,
            ease: "sine.inOut",
        })
    }

    moveToAndDisappear(x: number, y: number) {
        this.tl.clear();
        this.properties.opacity = 0;
        this.tl.to(this.properties,
            {
                opacity: 1,
                duration: 0.5,
                ease: "sine.inOut",
            });
        this.tl.to(this.position, {
            x: this.p.mouseX - this.width / 2,
            y: this.p.mouseY - this.width / 2,
            duration: 1,
            ease: "sine.inOut",
        })
        return this.tl.to(this.properties,
            {
                opacity: 0,
                duration: 1,
                ease: "sine.inOut",
                delay: 0.4,
        });
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
        money.moveToAndDisappear(p.mouseX, p.mouseY).then(() => {
            console.log("done");
        });
    }
};

export default createSketch;