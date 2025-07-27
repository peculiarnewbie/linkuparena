// WebSocketContext.tsx
import { createContext, useContext, createSignal, onCleanup, type Accessor } from "solid-js";
import { useNavigate } from "@tanstack/solid-router";

interface GameMessage {
    type: "lobby" | "game_start" | "game_state" | "error";
    data: any;
}

const WebSocketContext = createContext({
    connect: (message: any) => {},
    send: (message: any) => {},
    gameState: (() => {}) as Accessor<unknown>,
    ws: (() => {}) as Accessor<WebSocket | undefined>,
});

export function WebSocketProvider(props: { children: Element }) {
    const [ws, setWs] = createSignal<WebSocket>();
    const [gameState, setGameState] = createSignal();
    const navigate = useNavigate();

    const connect = (roomId: string) => {
        const websocket = new WebSocket(`wss://api/game/${roomId}`);

        websocket.onmessage = (event) => {
            const message: GameMessage = JSON.parse(event.data);

            switch (message.type) {
                case "lobby":
                    setGameState(message.data);
                    break;
                case "game_start":
                    setGameState(message.data);
                    // Navigate to game while keeping websocket
                    navigate({ to: "/r/$roomId", params: { roomId: roomId } });
                    break;
                case "game_state":
                    setGameState(message.data);
                    break;
            }
        };

        setWs(websocket);
    };

    const send = (message: any) => {
        ws()?.send(JSON.stringify(message));
    };

    onCleanup(() => {
        ws()?.close();
    });

    return (
        <WebSocketContext.Provider value={{ connect, send, gameState, ws }}>{props.children}</WebSocketContext.Provider>
    );
}

export function useWebSocket() {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("can't find WebSocketContext");
    }
    return context;
}
