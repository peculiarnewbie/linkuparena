import { createFileRoute } from "@tanstack/solid-router";
import { useWebSocket } from "@components/ws-provider";
import { Show, For, createEffect } from "solid-js";
import { Outlet } from "@tanstack/solid-router";

export const Route = createFileRoute("/r/$roomId")({
    component: RouteComponent,
});

function RouteComponent() {
    const params = Route.useParams();
    const { connect, gameState, send } = useWebSocket();

    createEffect(() => {
        connect(params().roomId);
    });

    return (
        <div class="room-container">
            <Show when={(gameState() as any).type === "lobby"}>
                <div class="lobby">
                    <h2>Room {params().roomId}</h2>
                    <div class="players">
                        <For each={(gameState() as any).players}>
                            {(player) => <div class="player">{player.name}</div>}
                        </For>
                    </div>
                    <button onClick={() => send({ type: "start_game" })}>Start Game</button>
                </div>
            </Show>

            {/* This will render GameComponent when navigated to /game */}
            <Outlet />
        </div>
    );
}
