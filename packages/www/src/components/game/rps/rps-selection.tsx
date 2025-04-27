import {
    animate,
    stagger,
    utils,
    type DOMTarget,
    type DOMTargetsArray,
} from "animejs";
import { RpsButton } from "./rps-button";
import { onMount } from "solid-js";
import { css } from "@tokenami/css";

const selectionArray = ["rock", "paper", "scissors"];

const animateSelection = (selections: any) => {
    animate(selections, {
        opacity: [
            { from: 0, ease: "outQuad", duration: 300 },
            { to: 1, ease: "outBounce", duration: 500, delay: 50 },
        ],
        y: [
            { to: "-5rem", ease: "outQuad", duration: 300 },
            { to: 0, ease: "outBounce", duration: 500, delay: 50 },
        ],
        delay: stagger(100),
        duration: stagger(200, { start: 500 }),
        alternate: true,
    });
};

const animateHideSelection = (selections: any) => {
    animate(selections, {
        opacity: 0,
        scale: 0,
        duration: 400,
    });
};

const animateSelected = (selection: any) => {
    animate(selection, {
        scale: 1.1,
        duration: 200,
    });
};

export const RpsSelection = (props: {
    select: (selection: number) => void;
}) => {
    let $rpsSelections: DOMTargetsArray;
    let $selectionContainers: DOMTargetsArray;

    const playerSelect = (selection: number) => {
        const toHide = [...$selectionContainers];
        const notSelected = [...$rpsSelections];
        const selected = notSelected.splice(selection, 1);
        notSelected.forEach((selection) => {
            const image = selection.querySelector("img");
            if (image) toHide.push(image);
        });
        animateHideSelection(toHide);
        const selectedImage = selected[0].querySelector("img");
        animateSelected(selectedImage);
        setTimeout(() => {
            props.select(selection);
        }, 500);
    };

    onMount(() => {
        $rpsSelections = utils.$(".selection");
        $selectionContainers = utils.$(".selection .container");
        animateSelection($rpsSelections);
        console.log($selectionContainers);
    });

    return (
        <div
            style={css({
                "--display": "flex",
                "--justify-content": "center",
                "--gap": 5,
                "--flex-basis": 1,
            })}
        >
            {selectionArray.map((selection, index) => (
                <RpsButton
                    index={index}
                    selection={selection}
                    select={playerSelect}
                />
            ))}
        </div>
    );
};
