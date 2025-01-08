import p5 from "p5";
import gsap from "gsap";

import moneyIMage from "@/assets/images/money.png";

const createSketch = (canvasContainer: HTMLDivElement) => (p: p5) => {
    let canvas;

    let img: p5.Image;
    let imagePosition = {
        x: 10,
        y: 10,
    }

    p.preload = () => {
        img = p.loadImage(moneyIMage);

    };
    const height = 500;
    p.setup = () => {
        canvas = p.createCanvas(800, height);

        canvas.parent(canvasContainer);
        p.background(220);
        img.resize(100, 0);
    }

    p.draw = () => {
        p.background(220);
        p.image(img, imagePosition.x, imagePosition.y);

    };

    p.mousePressed = () => {
        console.log(p.mouseX, p.mouseY);
        gsap.to(imagePosition, {
            x: p.mouseX,
            y: p.mouseY,
            duration: 1,
            ease: "power2.inOut",
        })
    }
};

export default createSketch;