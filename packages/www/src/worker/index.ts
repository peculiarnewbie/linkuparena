import { Env, Hono } from "hono";
import { DurableObject } from "cloudflare:workers";

const app = new Hono<{ Bindings: Cloudflare.Env }>();

app.get("/api/", (c) => {
    console.log("hono!");
    return c.json({
        id: "f9a5d8c0-1b3e-4a7c-8f0e-2d9b1c3a5e7b",
        user: {
            name: "Alice Wonderland",
            email: "alice.wonder@example.com",
            isActive: true,
            roles: ["admin", "editor"],
            preferences: {
                theme: "dark",
                notifications: {
                    email: true,
                    sms: false,
                },
            },
            address: null,
        },
        products: [
            { id: 1, name: "Laptop", price: 1200.5 },
            { id: 2, name: "Mouse", price: 25.99 },
            { id: 3, name: "Keyboard", price: 75.0 },
        ],
        metadata: {
            createdAt: "2025-05-04T15:46:00Z",
            version: 2.1,
            tags: ["data", "example", "nested"],
        },
        emptyObject: {},
        emptyArray: [],
    });
}).get("/api/game/:gameId/:roomId", (c) => {
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

    // This example will refer to the same Durable Object,
    // since the name "foo" is hardcoded.
    let id = c.env.LINKUP_ROOM.idFromName(roomId);
    let stub = c.env.LINKUP_ROOM.get(id);

    return stub.fetch(c.req.raw);
});

export class WebSocketHibernationServer extends DurableObject {
    async fetch(request) {
        // Creates two ends of a WebSocket connection.
        const webSocketPair = new WebSocketPair();
        const [client, server] = Object.values(webSocketPair);

        // Calling `acceptWebSocket()` informs the runtime that this WebSocket is to begin terminating
        // request within the Durable Object. It has the effect of "accepting" the connection,
        // and allowing the WebSocket to send and receive messages.
        // Unlike `ws.accept()`, `state.acceptWebSocket(ws)` informs the Workers Runtime that the WebSocket
        // is "hibernatable", so the runtime does not need to pin this Durable Object to memory while
        // the connection is open. During periods of inactivity, the Durable Object can be evicted
        // from memory, but the WebSocket connection will remain open. If at some later point the
        // WebSocket receives a message, the runtime will recreate the Durable Object
        // (run the `constructor`) and deliver the message to the appropriate handler.
        this.ctx.acceptWebSocket(server);

        return new Response(null, {
            status: 101,
            webSocket: client,
        });
    }

    async webSocketMessage(ws: WebSocket, message: ArrayBuffer | string) {
        // Upon receiving a message from the client, the server replies with the same message,
        // and the total number of connections with the "[Durable Object]: " prefix
        ws.send(
            `[Durable Object] message: ${message}, connections: ${this.ctx.getWebSockets().length}`,
        );
    }

    async webSocketClose(
        ws: WebSocket,
        code: number,
        reason: string,
        wasClean: boolean,
    ) {
        // If the client closes the connection, the runtime will invoke the webSocketClose() handler.
        ws.close(code, "Durable Object is closing WebSocket");
    }
}

export default app;
