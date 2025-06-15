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

export class WebSocketHibernationServer extends DurableObject {
    async fetch(request) {
        const webSocketPair = new WebSocketPair();
        const [client, server] = Object.values(webSocketPair);

        this.ctx.acceptWebSocket(server);

        return new Response(null, {
            status: 101,
            webSocket: client,
        });
    }

    async webSocketMessage(ws: WebSocket, message: ArrayBuffer | string) {
        this.ctx.getWebSockets().forEach((client) => {
            client.send(
                `[Durable Object] message: ${message}, connections: ${this.ctx.getWebSockets().length}`,
            );
        });
    }

    async webSocketClose(
        ws: WebSocket,
        code: number,
        reason: string,
        wasClean: boolean,
    ) {
        ws.close(code, "Durable Object is closing WebSocket");
    }
}

export default app;
