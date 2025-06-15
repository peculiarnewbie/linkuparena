import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/game/rps/$roomId")({
    component: RouteComponent,
});

function RouteComponent() {
    const params = Route.useParams();
    return <div>Hello {params().roomId}!</div>;
}
