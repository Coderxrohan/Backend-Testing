import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/routes": {
        target: "http://localhost:9191",
        changeOrigin: true,
      },
    },
  },
});
