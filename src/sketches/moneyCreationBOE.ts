import p5 from "p5";
import Society from "@/sketches/Animatables/Society";

export type MoneyCreationBOECallbackResult = {
    society: Society,
}

const createSketch = (canvasContainer: HTMLDivElement, width: number, height: number, banks: Array<string>, createCallback: (result: MoneyCreationBOECallbackResult) => void) => (p: p5) => {
    let canvas;

    const society = new Society(p, banks)

    p.setup = () => {
        canvas = p.createCanvas(width, height);
        canvas.parent(canvasContainer);
        p.background(120);
    }

    p.draw = () => {
        p.background(120);
        society.draw();
    }

    createCallback({society});
}

export default createSketch;