const { spawn } = require("child_process");
const path = require("path");
const { chromium } = require("playwright");

const port = 5199;
const viteExecutable = path.resolve(process.cwd(), "node_modules", "vite", "bin", "vite.js");

function waitForServer(child) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Vite dev server did not start in time")), 30000);
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://127.0.0.1:${port}/`);
        if (response.ok) {
          clearInterval(interval);
          clearTimeout(timeout);
          resolve();
        }
      } catch {
        // Keep polling until the timeout expires.
      }
    }, 500);

    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      if (text.includes("error") || text.includes("Error")) {
        clearInterval(interval);
        clearTimeout(timeout);
        reject(new Error(text));
      }
    });
    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      if (text.includes("error") || text.includes("Error")) {
        clearInterval(interval);
        clearTimeout(timeout);
        reject(new Error(text));
      }
    });
    child.on("exit", (code) => {
      clearInterval(interval);
      clearTimeout(timeout);
      reject(new Error(`Vite dev server exited early with code ${code}`));
    });
  });
}

async function main() {
  const child = spawn(process.execPath, [viteExecutable, "--host", "127.0.0.1", "--port", String(port), "--strictPort"], {
    cwd: process.cwd(),
    env: process.env,
    shell: false,
    stdio: ["ignore", "pipe", "pipe"]
  });

  try {
    await waitForServer(child);
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      const text = message.text();
      if (message.type() === "error" && !text.includes("Failed to load resource")) errors.push(text);
    });

    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
    await page.waitForSelector("canvas", { timeout: 15000 });

    const result = {
      h1: await page.locator("h1").innerText(),
      rootHtmlLength: await page.locator("#root").evaluate((node) => node.innerHTML.length),
      equipmentRows: await page.locator(".equipment-row").count(),
      canvasCount: await page.locator("canvas").count(),
      errors
    };
    console.log(JSON.stringify(result, null, 2));

    await browser.close();
    if (result.rootHtmlLength < 1000) throw new Error("Dev server rendered an empty app root");
    if (result.equipmentRows < 14) throw new Error("Dev server did not render expanded equipment list");
    if (result.canvasCount < 1) throw new Error("Dev server did not render the 3D canvas");
    if (errors.length) throw new Error(`Dev browser errors: ${errors.join("; ")}`);
  } finally {
    child.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
