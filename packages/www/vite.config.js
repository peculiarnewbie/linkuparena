import { defineConfig } from "vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import solidPlugin from "vite-plugin-solid";
import { cloudflare } from "@cloudflare/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [TanStackRouterVite({ target: "solid", autoCodeSplitting: true }), solidPlugin(), cloudflare()],
    resolve: {
        alias: {
            "@components": resolve(__dirname, "./src/components"),
            "@utils": resolve(__dirname, "./src/utils"),
        },
    },
});
