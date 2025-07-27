import { WebSocketProvider } from "@components/ws-provider";
import { Outlet, createRootRouteWithContext } from "@tanstack/solid-router";
import { TanStackRouterDevtools } from "@tanstack/solid-router-devtools";

export const Route = createRootRouteWithContext()({
    component: RootComponent,
});

function RootComponent() {
    return (
        <>
            <WebSocketProvider>
                <Outlet />
            </WebSocketProvider>
            <TanStackRouterDevtools />
        </>
    );
}
