import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import solidPlugin from "vite-plugin-solid";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [tanstackRouter({ target: "solid", autoCodeSplitting: true }), solidPlugin(), cloudflare()],
    resolve: {
        alias: {
            "@components": resolve(__dirname, "./src/components"),
            "@utils": resolve(__dirname, "./src/utils"),
        },
    },
});
