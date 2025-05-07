// app.config.ts
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

import { defineConfig } from "@tanstack/react-start/config";

export default defineConfig({
  tsr: {
    appDirectory: "src",
  },
  vite: {
    plugins: [
      tailwindcss(),
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
    ],
    build: {
      rollupOptions: {
        external: ["iso-3166-2"],
      },
    },
  },
  server: {
    prerender: {
      routes: ["/", "/about", "/blogs", "/contact", "/services"],
      crawlLinks: true,
    },
  },
});
