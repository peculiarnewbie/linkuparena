import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/what")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/what"!</div>;
}
