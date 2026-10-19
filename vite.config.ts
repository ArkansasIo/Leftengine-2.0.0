import { defineConfig } from "vite";

export default defineConfig({
  // Vite rewrites this to the repository path for project Pages.
  base: process.env.GITHUB_ACTIONS === "true" ? "/Leftengine-2.0.0/" : "/",
  build: { sourcemap: true },
});
