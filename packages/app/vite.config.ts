import build from "@hono/vite-build/cloudflare-workers";
import adapter from "@hono/vite-dev-server/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import honox from "honox/vite";
import { defineConfig } from "vite";

export default defineConfig({
  // Keep the client build (client.ts + CSS) when the worker build runs second.
  build: {
    emptyOutDir: false,
  },
  plugins: [
    honox({
      devServer: { adapter },
      // input replaces honox's default of ["/app/client.ts"] — include both.
      client: { input: ["/app/client.ts", "/app/style.css"] },
    }),
    build(),
    tailwindcss(),
  ],
});
