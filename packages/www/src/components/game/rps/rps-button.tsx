import { css } from "@tokenami/css";
import { animate, type DOMTarget } from "animejs";
import { onMount } from "solid-js";

const enter = (element: DOMTarget) => {
    animate(element, { scale: 1.1, duration: 200 });
    element.style.zIndex = "50";
};
const leave = (element: DOMTarget) => {
    animate(element, { scale: 1, duration: 100 });
    element.style.zIndex = "1";
};

export const RpsButton = (props: {
    index: number;
    selection: string;
    select: (selection: number) => void;
}) => {
    const svgPath = (selection: number) => {
        switch (selection) {
            case 0:
                return "/assets/game/rps/rock.svg";
            case 1:
                return "/assets/game/rps/paper.svg";
            case 2:
                return "/assets/game/rps/scissors.svg";
        }
    };

    let ref: HTMLDivElement | undefined;

    onMount(() => {
        if (!ref) return;
        ref.addEventListener("mouseenter", () => enter(ref));
        ref.addEventListener("mouseleave", () => leave(ref));
    });

    return (
        <div
            onclick={() => props.select(props.index)}
            style={css({
                "--display": "grid",
                "--place-items": "center",
                "--grid-column": 1,
                "--grid-row": 1,
                "--position": "relative",
                "--width": 50,
                "--height": 50,
            })}
            class="selection"
            ref={ref}
        >
            <div
                class="container"
                style={css({
                    "--border-radius": "var(--radii_xl)",
                    "--border": "var(--border_rpsButton)",
                    "--box-shadow": "var(--shadow_xl)",
                    "--font-size": "var(--font-size_huge)",
                    "--padding": 0,
                    "--position": "absolute",
                    "--background-color": "var(--color_pink)",
                    "--width": 50,
                    "--height": 50,
                    // "--top": "50%",
                    // left: "50%",
                    // "--transform": "translate(-50%, -50%)",
                })}
            ></div>
            <img
                src={svgPath(props.index)}
                style={css({
                    "--width": 35,
                    "--z-index": 2,
                })}
            />
        </div>
    );
};
