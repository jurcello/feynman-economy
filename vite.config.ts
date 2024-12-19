import { defineConfig } from "vite";
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    root: ".", // Ensures it serves from the project's root
    build: {
        outDir: "dist",
    },
    plugins: [vue()],
});