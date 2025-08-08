import { createFileRoute, useNavigate } from "@tanstack/solid-router";
import { useWebSocket } from "@components/ws-provider";
import { Show, For, createEffect } from "solid-js";

export const Route = createFileRoute("/game/test/$roomId")({
    component: RouteComponent,
});

function RouteComponent() {
    const params = Route.useParams();
    const { players, ws } = useWebSocket();
    const navigate = useNavigate();

    createEffect(() => {
        if (!ws()) {
            navigate({ to: "/r/$roomId", params: { roomId: params().roomId } });
        }
    });

    const namedPlayers = () => players().filter(p => !p.isAnonymous);
    const anonymousPlayer = () => players().find(p => p.isAnonymous);

    return (
        <div class="test-room-container">
            <h2>Test Room {params().roomId}</h2>
            <div class="flex flex-col">
                <p>players</p>
                <For each={namedPlayers()}>{(player) => <div class="player">{player.displayName}</div>}</For>
                <Show when={anonymousPlayer()}>
                    <div class="anonymous-count">{anonymousPlayer()?.displayName}</div>
                </Show>
            </div>
        </div>
    );
}