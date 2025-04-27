import { createFileRoute } from "@tanstack/solid-router";
import { createEffect, createSignal, onMount } from "solid-js";
import { css } from "@tokenami/css";
import { animate, createSpring, stagger } from "animejs";

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

const rpsButton = css.compose({
    "--border-radius": "var(--radii_xl)",
    "--border": "var(--border_rpsButton)",
    "--box-shadow": "var(--shadow_xl)",
});

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

    let resultRef: HTMLDivElement | undefined;

    createEffect(() => {});

    const animateSelection = () => {
        animate(".selection", {
            opacity: [
                { from: 0, ease: "outQuad", duration: 600 },
                { to: 1, ease: "outBounce", duration: 800, delay: 100 },
            ],
            y: [
                { to: "-7rem", ease: "outQuad", duration: 600 },
                { to: 0, ease: "outBounce", duration: 800, delay: 100 },
            ],
            delay: stagger(100),
            duration: stagger(200, { start: 500 }),
            alternate: true,
        });
    };

    onMount(() => {
        randomizePlayer1Selection();
        animate(".bounce", {
            scale: [
                { to: 1.1, ease: "inOut(3)", duration: 200 },
                { to: 1, ease: createSpring({ stiffness: 100 }) },
            ],
            loop: true,
        });

        animateSelection();
    });

    const [rpsCn, rpsCss] = rpsButton();

    return (
        <div
            style={css({
                "--height": "var(--size_screen)",
                "--background": "var(--color_bg)",
                "--color": "var(--color_text-main)",
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
                                    animateSelection();
                                }}
                            >
                                restart
                            </button>
                        </div>
                    ) : (
                        ``
                    )}
                </div>
                <div
                    style={css({
                        "--display": "flex",
                        "--justify-content": "center",
                        "--gap": 3,
                        "--flex-basis": 1,
                    })}
                >
                    {revealed()
                        ? selectionArray[player2Selection()]
                        : selectionArray.map((selection, index) => (
                              <button
                                  onclick={() => {
                                      setPlayer2Selection(index);
                                      setRevealed(true);
                                  }}
                                  class={rpsCn("selection")}
                                  style={css({
                                      "--font-size": "var(--font-size_huge)",
                                  })}
                              >
                                  {selection}
                              </button>
                          ))}
                </div>
            </div>
        </div>
    );
}
