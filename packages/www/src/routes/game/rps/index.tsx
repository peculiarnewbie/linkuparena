import { createFileRoute } from "@tanstack/solid-router";
import { createSignal, onMount } from "solid-js";
import { css } from "@tokenami/css";
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
    const [player1Selection, setPlayer1Selection] = createSignal<number>(0);
    const [player2Selection, setPlayer2Selection] = createSignal<number>(0);

    const [revealed, setRevealed] = createSignal(false);

    const randomizePlayer1Selection = () => {
        const randomSelection = Math.floor(
            Math.random() * selectionArray.length
        );
        setPlayer1Selection(randomSelection);
    };

    const playerSelect = (selection: number) => {
        setPlayer2Selection(selection);
        setRevealed(true);
    };

    let resultRef: HTMLDivElement | undefined;

    onMount(() => {
        randomizePlayer1Selection();
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
                "--height": "var(--size_screen)",
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
                    "--height": "var(--size_full)",
                    "--justify-content": "space-evenly",
                    "--font-size": "var(--font-size_huge)",
                })}
            >
                <div
                    style={css({
                        "--flex-basis": 1,
                        "--display": "flex",
                        "--justify-content": "center",
                    })}
                    class="bounce"
                >
                    {revealed()
                        ? selectionArray[player1Selection()]
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
                                {result(player1Selection(), player2Selection())}
                            </div>
                            <button
                                onclick={() => {
                                    setRevealed(false);
                                    randomizePlayer1Selection();
                                }}
                                style={css({
                                    "--font-size": "var(--font-size_huge)",
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
                        selectionArray[player2Selection()]
                    ) : (
                        <RpsSelection select={playerSelect} />
                    )}
                </div>
            </div>
        </div>
    );
}
