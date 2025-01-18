import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3051,
    strictPort: true,
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:3050",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020",
      define: {
        global: "globalThis",
      },
      jsx: "automatic",
    },
  },
  build: {
    target: "es2020",
    sourcemap: true,
  },
});
