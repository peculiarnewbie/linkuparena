import { Env, Hono } from "hono";
import { DurableObject } from "cloudflare:workers";

const app = new Hono<{ Bindings: Cloudflare.Env }>();

app.get("/api/", (c) => {
    console.log("hono!");
    return c.json({
        value: "test",
    });
}).get("/api/game/:roomId", (c) => {
    const gameId = c.req.param("gameId");
    const roomId = c.req.param("roomId");

    console.log("gameId", gameId);
    console.log("roomId", roomId);

    const upgradeHeader = c.req.header("Upgrade");
    if (!upgradeHeader || upgradeHeader !== "websocket") {
        return new Response("Durable Object expected Upgrade: websocket", {
            status: 426,
        });
    }

    let id = c.env.LINKUP_ROOM.idFromName(roomId);
    let stub = c.env.LINKUP_ROOM.get(id);

    return stub.fetch(c.req.raw);
});

export class WebSocketServer extends DurableObject {
    players: Map<WebSocket, any>;
    
    constructor(ctx: any, env: any) {
        super(ctx, env);
        this.players = new Map(); // Store player data with WebSocket as key
    }

    async fetch(request: Request) {
        const webSocketPair = new WebSocketPair();
        const [client, server] = Object.values(webSocketPair);

        // Accept the WebSocket connection
        (this.ctx as any).acceptWebSocket(server);

        return new Response(null, {
            status: 101,
            webSocket: client,
        } as any);
    }

    async webSocketMessage(ws: WebSocket, message: ArrayBuffer | string) {
        try {
            const data = JSON.parse(message as string);
            
            switch (data.type) {
                case "joins":
                    // Store player info with WebSocket as key
                    const playerId = crypto.randomUUID();
                    const existingPlayer = this.players.get(ws);
                    this.players.set(ws, {
                        id: existingPlayer?.id || playerId,
                        displayName: data.data.displayName,
                        ws: ws
                    });
                    
                    // Broadcast updated player list to all clients
                    this.broadcastPlayerList();
                    break;
                    
                case "name_update":
                    // Update player name
                    const player = this.players.get(ws);
                    if (player) {
                        player.displayName = data.data.displayName;
                        this.players.set(ws, player);
                        this.broadcastPlayerList();
                    }
                    break;
                    
                default:
                    // For other message types, just broadcast as-is
                    this.broadcastMessage(message);
                    break;
            }
        } catch (error) {
            console.error("Error processing message:", error);
        }
    }

    async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
        // Remove player when WebSocket closes
        this.players.delete(ws);
        
        // Broadcast updated player list
        this.broadcastPlayerList();
        
        ws.close(code, "Durable Object is closing WebSocket");
    }

    async webSocketError(ws: WebSocket, error: any) {
        // Remove player on error
        this.players.delete(ws);
        this.broadcastPlayerList();
    }

    broadcastPlayerList() {
        const namedPlayers = Array.from(this.players.values()).filter((player: any) => player.displayName && player.displayName !== "");
        const anonymousCount = Array.from(this.players.values()).filter((player: any) => !player.displayName || player.displayName === "").length;
        
        const playerList = namedPlayers.map((player: any) => ({
            id: player.id,
            displayName: player.displayName,
            isAnonymous: false
        }));
        
        if (anonymousCount > 0) {
            playerList.push({
                id: "anonymous",
                displayName: `and ${anonymousCount} anonymous player${anonymousCount > 1 ? 's' : ''}`,
                isAnonymous: true
            });
        }
        
        const message = JSON.stringify({
            type: "players",
            data: playerList
        });
        
        this.broadcastMessage(message);
    }

    broadcastMessage(message: any) {
        // Send to all connected clients
        (this.ctx as any).getWebSockets().forEach((client: WebSocket) => {
            try {
                client.send(message);
            } catch (error) {
                console.error("Error sending message to client:", error);
            }
        });
    }
}
export default app;
