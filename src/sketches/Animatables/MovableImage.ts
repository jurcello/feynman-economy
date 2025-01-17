import p5 from "p5";
import moneyIMage from "@/assets/images/money.png";
import person1Image from "@/assets/images/person1.png";
import person2Image from "@/assets/images/person2.png";
// import gsap from "gsap";
import gsapinstance from "gsap";
import Timeline = gsap.core.Timeline;

export enum MovableImageType {
    money = "money",
    person1 = "person1",
    person2 = "person2",
}

class MovableImage {
    private p: p5;
    public position: { x: number; y: number } = {x: 0, y: 0};
    public offset: { x: number; y: number } = {x: 0, y: 0};
    public properties: { opacity: number } = {opacity: 0};
    private image: p5.Image;
    private width: number = 70;
    private tl: Timeline;

    constructor(p: p5, x: number, y: number, type: MovableImageType = MovableImageType.money) {
        this.p = p;
        this.position.x = x - this.width / 2;
        this.position.y = y - this.width / 2;
        let image = moneyIMage;
        switch (type) {
            case MovableImageType.person1:
                image = person1Image;
                break;
            case MovableImageType.person2:
                image = person2Image;
                break;
        }
        this.image = p.loadImage(image, () => {
            this.image.resize(this.width, 0);
        });
        this.tl = gsapinstance.timeline();
    }

    draw() {
        if (this.properties.opacity > 0) {
            this.p.tint(255, 255, 255, this.properties.opacity * 255);
            this.p.image(this.image, this.position.x + this.offset.x, this.position.y + this.offset.y);
            this.p.tint(255, 255, 255, 255);
        }
    }

    moveTo(x: number, y: number) {
        this.tl.to(this.position, {
            x: this.p.mouseX - this.width / 2,
            y: this.p.mouseY - this.width / 2,
            duration: 1,
            ease: "sine.inOut",
        })
    }

    moveFromTo(from: { x: number, y: number }, to: { x: number, y: number }) {
        this.tl.clear();
        this.properties.opacity = 0;
        this.position.x = from.x - this.width / 2;
        this.position.y = from.y - this.width / 2;
        this.tl.to(this.properties,
            {
                opacity: 1,
                duration: 0.5,
                ease: "sine.inOut",
            });
        this.tl.to(this.position, {
            x: to.x - this.width / 2,
            y: to.y - this.width / 2,
            duration: 1,
            ease: "sine.inOut",
        })
        return this.tl.to(this.properties,
            {
                duration: 1,
                ease: "sine.inOut",
                delay: 0.4,
            });
    }

    disappear() {
        if (this.tl) {
            this.tl.clear();
        }
        return this.tl.to(this.properties,
            {
                opacity: 0,
                duration: 1,
                ease: "sine.inOut",
            })
    }

    moveToAndDisappear() {
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

export default MovableImage;