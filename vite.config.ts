import { defineConfig } from "vite";
import vue from '@vitejs/plugin-vue';
import {fileURLToPath} from "node:url";

export default defineConfig({
    root: ".", // Ensures it serves from the project's root
    build: {
        outDir: "dist",
    },
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)), // Alias @ to src
        },
    },
});