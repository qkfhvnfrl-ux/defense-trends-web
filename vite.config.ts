import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { existsSync, readFileSync } from "node:fs";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const version = existsSync(".openai/hosting.json") ? JSON.parse(readFileSync("releases.json", "utf8")).current as string : null;
const base = process.env.SITE_VERSION_BASE ?? (version ? `/versions/${version}/` : null) ?? (process.env.GITHUB_ACTIONS === "true" && repositoryName ? `/${repositoryName}/` : "/");

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5173
  }
});
