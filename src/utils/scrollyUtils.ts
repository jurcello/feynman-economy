import {ScrollTrigger} from "@/plugins/gsap";
import {gsap} from "gsap";

function createMoveToLeftTrigger(trigger: string, target: string, elementWidth: number) {
    const element = document.querySelector(`#${target}`);
    const viewportWidth = window.innerWidth;
    const leftPosition = (viewportWidth/2) - (elementWidth/2);

    ScrollTrigger.create({
        trigger: `#${trigger}`,
        start: 'top center-=100px',
        onEnter: () => {
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
        onEnterBack: () => {
            const element = document.querySelector(`#${target}`);
            gsap.to(element, {
                left: leftPosition,
            }).then(() => {
                gsap.set(element, {
                    position: "static",
                });
            })
        }
    });
}
const revealBalance = (trigger: string, target: string, balanceWidth: number) => {
    ScrollTrigger.create({
        trigger: `#${trigger}`,
        start: 'top center-=100px',
        onEnter: () => {
            const targetId = `#${target}`;
            gsap.set(targetId, {
                display: "flex",
                width: "0px",
                opacity: 0,
            });
            gsap.to(targetId, {
                width: `${balanceWidth}px`,
                opacity: 1,
                duration: 1,
                ease: "power2.inOut",
            });
        },
        onEnterBack: () => {
            const targetId = `#${target}`;
            gsap.to(targetId, {
                width: "0px",
                opacity: 0,
                duration: 1,
                ease: "power2.inOut",
            });
        },
    });
};

const createPinnedSheetScrollTrigger = (trigger: string, endTrigger: string) => {
    const triggerId = `#${trigger}`;
    const endTriggerID = `#${endTrigger}`;
    ScrollTrigger.create({
        trigger: triggerId,
        endTrigger: endTriggerID,
        start: 'top-=100px top',
        end: 'top top',
        pin: true,
        pinSpacing: false,
        markers: true,
    })
}



export {createMoveToLeftTrigger, revealBalance, createPinnedSheetScrollTrigger}