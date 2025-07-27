import { createFileRoute } from "@tanstack/solid-router";
import { useWebSocket } from "@components/ws-provider";
import { Show, For, createEffect, createSignal } from "solid-js";
import { Outlet } from "@tanstack/solid-router";

export const Route = createFileRoute("/r/$roomId")({
    component: RouteComponent,
});

function RouteComponent() {
    const params = Route.useParams();
    const { connect, gameState, send, players } = useWebSocket();
    const [displayName, setDisplayName] = createSignal("");

    const connectToRoom = (name: string) => {
        connect(params().roomId, name);
    };

    return (
        <div class="room-container">
            {/* This will render GameComponent when navigated to /game */}
            <Outlet />
            <h2>Room {params().roomId}</h2>
            <div>
                <div>your name:</div>
                <input type="text" oninput={(e) => setDisplayName(e.target.value)} />
                <button onclick={() => connectToRoom(displayName())}>connect</button>
            </div>
            <div class="flex flex-col">
                <p>players</p>
                <For each={players()}>{(player) => <div class="player">{player.displayName}</div>}</For>
            </div>
        </div>
    );
}
