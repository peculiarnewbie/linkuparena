import { createFileRoute } from "@tanstack/solid-router";
import { createSignal, onMount } from "solid-js";
import { css } from "@tokenami/css";

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

    onMount(() => {
        randomizePlayer1Selection();
    });

    return (
        <div style={{ height: "100vh" }}>
            <div
                style={css({
                    "--display": "flex",
                    "--flex-direction": "column",
                    "--height": "var(--size_full)",
                    "--justify-content": "space-evenly",
                })}
            >
                <div
                    style={css({
                        "--flex-basis": 1,
                        "--display": "flex",
                        "--justify-content": "center",
                    })}
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
                              >
                                  {selection}
                              </button>
                          ))}
                </div>
            </div>
        </div>
    );
}
