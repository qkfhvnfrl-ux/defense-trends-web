const { chromium } = require("playwright");

const targets = process.argv.slice(2);
if (!targets.length) {
  console.error("Usage: node scripts/diagnose-page.cjs http://127.0.0.1:5173/");
  process.exit(1);
}

async function diagnose(target) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  const messages = [];
  const pageErrors = [];
  page.on("console", (message) => messages.push({ type: message.type(), text: message.text() }));
  page.on("pageerror", (error) => pageErrors.push(error.message));

  let status = null;
  let gotoError = null;
  try {
    const response = await page.goto(target, { waitUntil: "networkidle", timeout: 30000 });
    status = response?.status() ?? null;
  } catch (error) {
    gotoError = error.message;
  }

  const result = {
    target,
    status,
    gotoError,
    title: await page.title().catch(() => ""),
    bodyText: await page.locator("body").innerText({ timeout: 3000 }).catch(() => ""),
    rootHtmlLength: await page.locator("#root").evaluate((node) => node.innerHTML.length).catch(() => null),
    h1: await page.locator("h1").innerText({ timeout: 3000 }).catch(() => null),
    canvasCount: await page.locator("canvas").count().catch(() => 0),
    messages,
    pageErrors
  };

  await browser.close();
  return result;
}

(async () => {
  const results = [];
  for (const target of targets) {
    results.push(await diagnose(target));
  }
  console.log(JSON.stringify(results, null, 2));
})();
