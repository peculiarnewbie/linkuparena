// WebSocketContext.tsx
import { createContext, useContext, createSignal, onCleanup, type Accessor, type JSXElement } from "solid-js";
import { useNavigate } from "@tanstack/solid-router";

interface GameMessage {
    type: "lobby" | "game_start" | "game_state" | "error" | "joins" | "players" | "name_update";
    data: any;
}

type Player = {
    displayName: string;
    id: string;
    isAnonymous: boolean;
};

const WebSocketContext = createContext({
    connect: (roomId: string, displayName?: string) => {},
    send: (message: any) => {},
    gameState: (() => undefined) as Accessor<GameMessage | undefined>,
    ws: (() => undefined) as Accessor<WebSocket | undefined>,
    players: (() => []) as Accessor<Player[]>,
    updateName: (displayName: string) => {},
});
export function WebSocketProvider(props: { children: JSXElement }) {
    const [ws, setWs] = createSignal<WebSocket>();
    const [gameState, setGameState] = createSignal<GameMessage | undefined>();
    const [players, setPlayers] = createSignal<Player[]>([]);
    const navigate = useNavigate();

    const connect = (roomId: string, displayName?: string) => {
        console.log("trying to connect to ws");
        const websocket = new WebSocket(`/api/game/${roomId}`);

        websocket.addEventListener("open", (e) => {
            if (displayName) {
                websocket.send(JSON.stringify({ type: "joins", data: { displayName } } satisfies GameMessage));
            } else {
                websocket.send(JSON.stringify({ type: "joins", data: { displayName: "" } } satisfies GameMessage));
            }
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
                    // Handled by server - now we wait for "players" message
                    break;
                case "players":
                    // Server sends full player list
                    const playerList: Player[] = message.data.map((player: any) => ({
                        displayName: player.displayName,
                        id: player.id,
                        isAnonymous: !player.displayName || player.displayName === "",
                    }));
                    setPlayers(playerList);
                    break;
                case "name_update":
                    // Handle name updates from server
                    const updatedPlayers: Player[] = message.data.map((player: any) => ({
                        displayName: player.displayName,
                        id: player.id,
                        isAnonymous: !player.displayName || player.displayName === "",
                    }));
                    setPlayers(updatedPlayers);
                    break;
            }
        });

        setWs(websocket);
        return websocket;
    };

    const updateName = (displayName: string) => {
        send({ type: "name_update", data: { displayName } });
    };

    const send = (message: any) => {
        ws()?.send(JSON.stringify(message));
    };

    onCleanup(() => {
        ws()?.close();
    });

    return (
        <WebSocketContext.Provider value={{ connect, send, gameState, ws, players, updateName }}>
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
