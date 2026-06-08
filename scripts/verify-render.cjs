const { PNG } = require("pngjs");
const { chromium } = require("playwright");
const { server } = require("./serve-dist.cjs");

function countDistinctPixels(png) {
  const colors = new Set();
  for (let index = 0; index < png.data.length; index += 4) {
    colors.add(`${png.data[index]},${png.data[index + 1]},${png.data[index + 2]},${png.data[index + 3]}`);
    if (colors.size > 40) return colors.size;
  }
  return colors.size;
}

async function main() {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  const ignoredConsoleErrors = [
    "Failed to load resource: the server responded with a status of 404",
    "Failed to load resource: net::ERR_NETWORK_ACCESS_DENIED"
  ];

  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    const text = message.text();
    if (message.type() === "error" && !ignoredConsoleErrors.some((ignored) => text.includes(ignored))) {
      errors.push(text);
    }
  });

  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.waitForSelector("canvas", { timeout: 15000 });
  await page.locator(".hotspot").first().click();

  const canvasShot = await page.locator("canvas").screenshot();
  const canvasPng = PNG.sync.read(canvasShot);
  const desktop = {
    title: await page.locator("h1").innerText(),
    equipmentRows: await page.locator(".equipment-row").count(),
    markers: await page.locator(".case-marker").count(),
    koreanMapLabels: await page.locator(".korean-region-label").evaluateAll((nodes) =>
      nodes.map((node) => node.textContent?.trim()).filter(Boolean)
    ),
    hotspots: await page.locator(".hotspot").count(),
    modalTitle: await page.locator(".component-modal h2").innerText(),
    canvasBox: await page.locator("canvas").boundingBox(),
    canvasDistinctColors: countDistinctPixels(canvasPng)
  };

  const routeChecks = [];
  for (const route of ["/", "/equipment", "/equipment/m2a2-bradley", "/development", "/compare", "/technologies", "/cases"]) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    const rootLength = await page.locator("#root").evaluate((node) => node.innerHTML.length);
    const hasHeading = await page.locator("h1, h2").first().isVisible();
    routeChecks.push({ route, rootLength, hasHeading });
  }

  const mobile = await browser.newPage({ viewport: { width: 390, height: 900 } });
  await mobile.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await mobile.waitForSelector("canvas", { timeout: 15000 });

  const mobileResult = {
    equipmentRows: await mobile.locator(".equipment-row").count(),
    canvasBox: await mobile.locator("canvas").boundingBox(),
    bodyWidth: await mobile.evaluate(() => document.body.scrollWidth),
    viewportWidth: await mobile.evaluate(() => window.innerWidth)
  };

  await browser.close();
  server.close();

  console.log(JSON.stringify({ desktop, mobile: mobileResult, routeChecks, errors }, null, 2));

  if (desktop.equipmentRows < 14) throw new Error("Expected expanded equipment rows");
  if (desktop.markers < 6) throw new Error("Expected battlefield markers");
  if (!desktop.koreanMapLabels.includes("우크라이나") || !desktop.koreanMapLabels.includes("유럽")) {
    throw new Error("Expected Korean map labels");
  }
  if (desktop.hotspots < 1) throw new Error("Expected component hotspots");
  if (desktop.canvasDistinctColors < 20) throw new Error("Canvas appears blank");
  if (mobileResult.bodyWidth > mobileResult.viewportWidth + 1) throw new Error("Mobile layout has horizontal overflow");
  for (const route of routeChecks) {
    if (route.rootLength < 1000 || !route.hasHeading) throw new Error(`Route ${route.route} did not render correctly`);
  }
  if (errors.length) throw new Error(`Browser errors: ${errors.join("; ")}`);
}

main().catch((error) => {
  server.close();
  console.error(error);
  process.exit(1);
});
