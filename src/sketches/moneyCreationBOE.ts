import p5 from "p5";
import Society from "@/sketches/Animatables/Society";

export type MoneyCreationBOECallbackResult = {
    society: Society,
}

const createSketch = (canvasContainer: HTMLDivElement, width: number, height: number, banks: Array<string>, createCallback: (result: MoneyCreationBOECallbackResult) => void) => (p: p5) => {
    let canvas;

    const society = new Society(p, banks)
    const grayValue = 230;

    p.setup = () => {
        canvas = p.createCanvas(width, height);
        canvas.parent(canvasContainer);

        p.background(grayValue);
    }

    p.draw = () => {
        p.background(grayValue);
        society.draw();
    }

    p.mouseClicked = () => {
        console.log("mouse position", p.mouseX, p.mouseY);
    }

    createCallback({society});
}

export default createSketch;