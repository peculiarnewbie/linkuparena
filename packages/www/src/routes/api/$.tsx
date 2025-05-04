import { createFileRoute } from "@tanstack/solid-router";
import { createResource } from "solid-js";
import JsonViewer from "../../components/json-viewer/viewer";

export const Route = createFileRoute("/api/$")({
    component: RouteComponent,
});

function RouteComponent() {
    const [data] = createResource(async () => {
        const url = new URL(document.location.href);
        const res = await fetch(url.pathname);
        if (res.status !== 200) {
            return { status: res.status, message: res.statusText };
        }
        const json = await res.json();
        return json;
    });
    return (
        <div>
            <JsonViewer data={data()} />
        </div>
    );
}
