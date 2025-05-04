import { createFileRoute } from "@tanstack/solid-router";
import { createResource } from "solid-js";
import JsonViewer from "../../components/json-viewer/viewer";

export const Route = createFileRoute("/api/")({
    component: RouteComponent,
});

function RouteComponent() {
    const [data] = createResource(async () => {
        const res = await fetch("/api/");
        const json = await res.json();
        return json;
    });
    return (
        <div>
            <JsonViewer data={data()} />
        </div>
    );
}
