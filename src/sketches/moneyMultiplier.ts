import p5 from "p5";
import MovableImage, {MovableImageType} from "@/sketches/Animatables/MovableImage";
import Society from "@/sketches/Animatables/Society";

export type MoneyMultiplierSketchCallback = {
    society: Society,
    money: MovableImage,
    person1: MovableImage,
    person2: MovableImage,
};

const createSketch = (canvasContainer: HTMLDivElement, banks: Array<string>, createCallback: (result: MoneyMultiplierSketchCallback) => void) => (p: p5) => {
    let canvas;

    const money = new MovableImage(p, 50, 50);
    const person1 = new MovableImage(p, 100, 100, MovableImageType.person1);
    const person2 = new MovableImage(p, 100, 100, MovableImageType.person2);

    const height = 500;

    const society = new Society(p, banks);

    p.setup = () => {
        canvas = p.createCanvas(1200, height);

        canvas.parent(canvasContainer);
        p.background(220);
    }

    p.draw = () => {
        p.background(220);
        society.draw();
        person1.draw();
        person2.draw();
        money.draw();
    };

    createCallback({society, money, person1, person2});
};

export default createSketch;