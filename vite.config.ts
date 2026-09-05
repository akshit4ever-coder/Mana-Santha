import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwind from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [
    // Nitro plugin must run before other plugins so it can generate server functions
    nitro({ preset: "vercel" as any }),
    tanstackStart({ server: { entry: "server" } }),
    react(),
    tailwind(),
    tsconfigPaths(),
  ],
});
