import p5 from "p5";
import Money from "@/sketches/Animatables/Money";
import Society from "@/sketches/Animatables/Society";

export type MoneyMultiplierSketchCallback = {
    society: Society,
    money: Money
};

const createSketch = (canvasContainer: HTMLDivElement, banks: Array<string>, createCallback: (result: MoneyMultiplierSketchCallback) => void) => (p: p5) => {
    let canvas;

    const money = new Money(p, 50, 50);

    const height = 500;

    const society = new Society(p, banks);

    p.setup = () => {
        canvas = p.createCanvas(1200, height);

        canvas.parent(canvasContainer);
        p.background(220);
    }

    p.draw = () => {
        p.background(220);
        money.draw();
        society.draw();

    };

    createCallback({society, money});

    p.mousePressed = () => {
        money.moveToAndDisappear(p.mouseX, p.mouseY).then(() => {
            console.log("done");
        });
    }
};

export default createSketch;