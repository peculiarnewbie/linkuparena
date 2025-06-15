import { createFileRoute } from "@tanstack/solid-router";
import { onMount, createSignal, onCleanup } from "solid-js";

export const Route = createFileRoute("/game/$roomId")({
    component: RouteComponent,
});

function RouteComponent() {
    const params = Route.useParams();
    const [messages, setMessages] = createSignal<string[]>([]);
    let ws: WebSocket;

    onMount(async () => {
        const wsUrl = `/api/game/${params().roomId}`;

        ws = new WebSocket(wsUrl);

        ws.addEventListener("open", () => {
            console.log("WebSocket connected to BFF");
            ws.send("Hello from client!");
        });

        ws.addEventListener("message", (event) => {
            setMessages((prev) => [...prev, event.data]);
            console.log(event);
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
            <button onClick={() => ws?.send("ping")}>ping</button>
        </div>
    );
}
