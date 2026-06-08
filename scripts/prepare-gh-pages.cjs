const fs = require("node:fs");
const path = require("node:path");

const distDir = path.resolve(__dirname, "..", "dist");
const indexPath = path.join(distDir, "index.html");
const notFoundPath = path.join(distDir, "404.html");

if (!fs.existsSync(indexPath)) {
  throw new Error("dist/index.html was not found. Run the production build first.");
}

fs.copyFileSync(indexPath, notFoundPath);
console.log("Prepared GitHub Pages SPA fallback: dist/404.html");
