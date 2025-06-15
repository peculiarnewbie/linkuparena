import { createFileRoute } from "@tanstack/solid-router";
import { createSignal, onMount } from "solid-js";
import { css } from "../../../css";
import { animate, createSpring } from "animejs";
import { RpsSelection } from "../../../components/game/rps/rps-selection";

export const Route = createFileRoute("/game/rps/")({
    component: RouteComponent,
});

const selectionArray = ["rock", "paper", "scissors"];

const result = (player1Selection: number, player2Selection: number) => {
    if (player1Selection === player2Selection) {
        return "draw";
    } else if (player1Selection === player2Selection + 1) {
        return "player 1 wins";
    } else {
        return "player 2 wins";
    }
};

function RouteComponent() {
    const [enemySelection, setEnemySelection] = createSignal<number>(0);
    const [playerSelection, setPlayerSelection] = createSignal<number>(0);

    const [revealed, setRevealed] = createSignal(false);

    const randomizeEnemySelection = () => {
        const randomSelection = Math.floor(
            Math.random() * selectionArray.length,
        );
        setEnemySelection(randomSelection);
    };

    const playerSelect = (selection: number) => {
        setPlayerSelection(selection);
        setRevealed(true);
    };

    let resultRef: HTMLDivElement | undefined;

    onMount(() => {
        randomizeEnemySelection();
        animate(".bounce", {
            scale: [
                { to: 1.1, ease: "inOut(3)", duration: 200 },
                { to: 1, ease: createSpring({ stiffness: 100 }) },
            ],
            loop: true,
        });
    });

    return (
        <div
            style={css({
                "--h": "var(--size_lvh)",
                "--background": "var(--color_bg)",
                "--color": "var(--color_text-main)",
                "--overflow": "hidden",
            })}
            class="theme-dark"
        >
            <div
                style={css({
                    "--display": "flex",
                    "--flex-direction": "column",
                    "--h": "var(--size_lvh)",
                    "--justify-content": "space-evenly",
                })}
            >
                <div
                    style={css({
                        "--flex-basis": 1,
                        "--display": "flex",
                        "--justify-content": "center",
                        "--font-size": "var(--fluid-text-size-clamp_sm-xl)",
                        "--fluid-text-size-min": "var(--fluid-text-size_2xl)",
                        "--fluid-text-size-max": "var(--fluid-text-size_7xl)",
                    })}
                    class="bounce"
                >
                    {revealed()
                        ? selectionArray[enemySelection()]
                        : `waiting for selection...`}
                </div>
                <div
                    style={css({
                        "--display": "flex",
                        "--justify-content": "center",
                    })}
                    ref={resultRef}
                >
                    {revealed() ? (
                        <div>
                            <div>
                                result:{" "}
                                {result(enemySelection(), playerSelection())}
                            </div>
                            <button
                                onclick={() => {
                                    setRevealed(false);
                                    randomizeEnemySelection();
                                }}
                                style={css({
                                    "--font-size": "var(--text-size_2xl)",
                                })}
                            >
                                restart
                            </button>
                        </div>
                    ) : (
                        ``
                    )}
                </div>
                <div>
                    {revealed() ? (
                        selectionArray[playerSelection()]
                    ) : (
                        <RpsSelection select={playerSelect} />
                    )}
                </div>
            </div>
        </div>
    );
}
