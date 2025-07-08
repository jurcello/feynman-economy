import {ScrollTrigger} from "@/plugins/gsap";
import {gsap} from "gsap";

function createMoveToLeftTrigger(trigger: string, target: string, elementWidth: number) {
    ScrollTrigger.create({
        trigger: `#${trigger}`,
        start: 'top center-=100px',
        onEnter: () => {
            const element = document.querySelector(`#${target}`);


            const viewportWidth = window.innerWidth;
            const leftPosition = (viewportWidth/2) - (elementWidth/2);

            gsap.set(element, {
                position: "absolute",
                left: leftPosition,
            });

            gsap.to(element, {
                left: 20,
                ease: "power2.inOut",
                duration: 1,
            })
        },
    });
}

export {createMoveToLeftTrigger}