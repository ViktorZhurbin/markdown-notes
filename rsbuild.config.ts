import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  html: {
    template: "./index.html",
  },
  source: {
    entry: {
      index: "./src/main.tsx",
    },
  },

  /* rsbuild keeps serving the UI with HMR; /api goes to `wrangler dev`, which
     holds the D1 binding. Both processes have to be running for local dev. */
  server: {
    proxy: {
      "/api": "http://localhost:8787",
    },
  },

  plugins: [pluginReact()],
});
