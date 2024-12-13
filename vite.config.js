import { defineConfig } from "vite";

export default defineConfig({
    root: ".", // Ensures it serves from the project's root
    build: {
        outDir: "dist",
    },
});