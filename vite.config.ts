import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/ollama/api": {
        target: "http://0.0.0.0:11434",
        rewrite: (path) => path.replace(/^\/ollama\/api/, "/api"),
      },
    },
  },
});
