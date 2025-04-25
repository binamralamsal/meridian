// app.config.ts
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "@tanstack/react-start/config";
var app_config_default = defineConfig({
  tsr: {
    appDirectory: "src"
  },
  vite: {
    plugins: [
      tailwindcss(),
      tsConfigPaths({
        projects: ["./tsconfig.json"]
      })
    ]
  },
  server: {
    prerender: {
      routes: ["/", "/about", "/blogs", "/contact", "/services"],
      crawlLinks: true
    }
  }
});
export {
  app_config_default as default
};
