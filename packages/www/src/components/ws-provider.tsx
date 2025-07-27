// WebSocketContext.tsx
import { createContext, useContext, createSignal, onCleanup, type Accessor, type JSXElement } from "solid-js";
import { useNavigate } from "@tanstack/solid-router";

interface GameMessage {
    type: "lobby" | "game_start" | "game_state" | "error" | "joins";
    data: any;
}

type Player = {
    displayName: string;
    id: string;
};

const WebSocketContext = createContext({
    connect: (roomId: string, displayName: string) => {},
    send: (message: any) => {},
    gameState: () => {},
    ws: () => {},
    players: (() => {}) as Accessor<Player[]>,
});

export function WebSocketProvider(props: { children: JSXElement }) {
    const [ws, setWs] = createSignal<WebSocket>();
    const [gameState, setGameState] = createSignal<GameMessage | undefined>();
    const [players, setPlayers] = createSignal<Player[]>([]);
    const navigate = useNavigate();

    const connect = (roomId: string, displayName: string) => {
        console.log("trying to connect to ws");
        const websocket = new WebSocket(`/api/game/${roomId}`);

        websocket.addEventListener("open", (e) => {
            websocket.send(JSON.stringify({ type: "joins", data: { displayName } } satisfies GameMessage));
        });

        websocket.addEventListener("message", (event) => {
            const message: GameMessage = JSON.parse(event.data);
            console.log("message", event.data, message, message.type);

            switch (message.type) {
                case "lobby":
                    setGameState(message);
                    break;
                case "game_start":
                    setGameState(message);
                    // Navigate to game while keeping websocket
                    navigate({ to: "/r/$roomId", params: { roomId: roomId } });
                    break;
                case "game_state":
                    setGameState(message);
                    break;
                case "joins":
                    const newPlayer: Player = {
                        displayName: message.data.displayName,
                        id: message.data.displayName,
                    };
                    console.log("new player", newPlayer);
                    setPlayers((prev) => [...prev, newPlayer]);
                    break;
            }
        });

        setWs(websocket);
    };

    const send = (message: any) => {
        ws()?.send(JSON.stringify(message));
    };

    onCleanup(() => {
        ws()?.close();
    });

    return (
        <WebSocketContext.Provider value={{ connect, send, gameState, ws, players }}>
            {props.children}
        </WebSocketContext.Provider>
    );
}

export function useWebSocket() {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("can't find WebSocketContext");
    }
    return context;
}
