import { createFileRoute, useNavigate } from "@tanstack/solid-router";
import { useWebSocket } from "@components/ws-provider";
import { Show, For, createEffect, createSignal, onMount } from "solid-js";
import { Outlet } from "@tanstack/solid-router";

export const Route = createFileRoute("/r/$roomId")({
    component: RouteComponent,
});

function RouteComponent() {
    const params = Route.useParams();
    const { connect, gameState, send, players, ws } = useWebSocket();
    const [displayName, setDisplayName] = createSignal("");
    const [isConnected, setIsConnected] = createSignal(false);
    const navigate = useNavigate();

    onMount(() => {
        if (!ws()) {
            connect(params().roomId);
            setIsConnected(true);
        }
    });

    const updatePlayerName = () => {
        if (displayName().trim()) {
            send({ type: "name_update", data: { displayName: displayName().trim() } });
        }
    };

    const goToTestRoom = () => {
        navigate({ to: "/game/test/$roomId", params: { roomId: params().roomId } });
    };

    const namedPlayers = () => players().filter(p => !p.isAnonymous);
    const anonymousPlayer = () => players().find(p => p.isAnonymous);

    return (
        <div class="room-container">
            <style>
                {`
                    .room-container {
                        max-width: 600px;
                        margin: 2rem auto;
                        padding: 2rem;
                        background: #f8f9fa;
                        border-radius: 12px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    }
                    h2 {
                        color: #333;
                        text-align: center;
                        margin-bottom: 1.5rem;
                    }
                    .name-section {
                        background: white;
                        padding: 1.5rem;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                        margin-bottom: 2rem;
                    }
                    .name-section div:first-child {
                        font-weight: 500;
                        margin-bottom: 0.5rem;
                        color: #555;
                    }
                    input[type="text"] {
                        width: 100%;
                        padding: 0.75rem;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        margin-bottom: 0.75rem;
                        font-size: 1rem;
                    }
                    button {
                        background: #007bff;
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 1rem;
                        transition: background 0.2s;
                    }
                    button:hover {
                        background: #0056b3;
                    }
                    .players-section {
                        background: white;
                        padding: 1.5rem;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    }
                    .players-section > p {
                        font-weight: 500;
                        margin-bottom: 1rem;
                        color: #555;
                    }
                    .player {
                        padding: 0.5rem;
                        background: #e9ecef;
                        border-radius: 4px;
                        margin-bottom: 0.5rem;
                    }
                    .anonymous-count {
                        padding: 0.5rem;
                        background: #fff3cd;
                        border-radius: 4px;
                        color: #856404;
                    }
                    .test-room-link {
                        display: block;
                        text-align: center;
                        margin-top: 1.5rem;
                        color: #007bff;
                        text-decoration: none;
                        font-weight: 500;
                    }
                    .test-room-link:hover {
                        text-decoration: underline;
                    }
                `}
            </style>
            {/* This will render GameComponent when navigated to /game */}
            <Outlet />
            <h2>Room {params().roomId}</h2>
            
            <div class="name-section">
                <div>Your name:</div>
                <input 
                    type="text" 
                    placeholder="Enter your name..." 
                    oninput={(e) => setDisplayName(e.target.value)} 
                />
                <button onclick={updatePlayerName}>Set Name</button>
            </div>
            
            <div class="players-section">
                <p>Players in room:</p>
                <For each={namedPlayers()}>{(player) => <div class="player">{player.displayName}</div>}</For>
                <Show when={anonymousPlayer()}>
                    <div class="anonymous-count">{anonymousPlayer()?.displayName}</div>
                </Show>
            </div>
            
            <a class="test-room-link" onclick={goToTestRoom}>
                Go to Test Room
            </a>
        </div>
    );
}