import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ["path", "crypto", "os", "stream", "fs"],
    }),
  ],
  build: {
    rollupOptions: {
      external: ["fs/promises"],
    },
  },
});
