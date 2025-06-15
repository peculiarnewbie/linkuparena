import { createFileRoute } from "@tanstack/solid-router";
import { onMount, createSignal, onCleanup } from "solid-js";

export const Route = createFileRoute("/game/rps/$roomId")({
    component: RouteComponent,
});

function RouteComponent() {
    const params = Route.useParams();
    const [messages, setMessages] = createSignal<string[]>([]);
    let ws: WebSocket;

    onMount(async () => {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `/api/game/rps/${params().roomId}`;
        console.log(wsUrl);

        const res = await fetch(wsUrl, {
            headers: {
                Upgrade: "websocket",
            },
        });
        console.log(res);

        ws = new WebSocket(wsUrl);

        ws.addEventListener("open", () => {
            console.log("WebSocket connected to BFF");
            ws.send("Hello from client!");
        });

        ws.addEventListener("message", (event) => {
            setMessages((prev) => [...prev, event.data]);
        });

        ws.addEventListener("error", (error) => {
            console.error("WebSocket error:", error);
        });

        onCleanup(() => {
            ws.close();
        });
    });
    return (
        <div>
            <h2>Game WebSocket Messages</h2>
            <ul>
                {messages().map((msg) => (
                    <li>{msg}</li>
                ))}
            </ul>
        </div>
    );
}
