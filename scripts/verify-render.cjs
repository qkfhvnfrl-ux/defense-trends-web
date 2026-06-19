const { chromium } = require("playwright");
const { server } = require("./serve-dist.cjs");

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
  await page.waitForSelector(".equipment-row", { timeout: 15000 });
  await page.locator(".component-slot").first().click();

  const desktop = {
    title: await page.locator("h1").innerText(),
    equipmentRows: await page.locator(".equipment-row").count(),
    markers: await page.locator(".case-marker").count(),
    modelSlots: await page.locator(".model-slot").count(),
    componentSlots: await page.locator(".component-slot").count(),
    filterSelects: await page.locator(".filter-grid select").count(),
    shareButtons: await page.locator(".share-search-button").count(),
    koreanMapLabels: await page.locator(".korean-region-label").evaluateAll((nodes) =>
      nodes.map((node) => node.textContent?.trim()).filter(Boolean)
    ),
    modalTitle: await page.locator(".component-modal h2").innerText()
  };
  await page.locator(".icon-close").click();
  await page.locator(".filter-grid select").first().selectOption({ label: "대드론/단거리방공" });
  desktop.roleFilteredRows = await page.locator(".equipment-row").count();
  desktop.roleUrlHasParam = page.url().includes("role=");
  await page.reload({ waitUntil: "networkidle" });
  desktop.reloadedRoleFilteredRows = await page.locator(".equipment-row").count();
  await page.getByRole("button", { name: "초기화" }).click();

  const routeChecks = [];
  for (const route of ["/", "/equipment", "/equipment/m2a2-bradley", "/insights", "/sources", "/development", "/compare", "/technologies", "/cases"]) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    const rootLength = await page.locator("#root").evaluate((node) => node.innerHTML.length);
    const hasHeading = await page.locator("h1, h2").first().isVisible();
    routeChecks.push({ route, rootLength, hasHeading });
  }

  const mobile = await browser.newPage({ viewport: { width: 390, height: 900 } });
  await mobile.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await mobile.waitForSelector(".equipment-row", { timeout: 15000 });

  const mobileResult = {
    equipmentRows: await mobile.locator(".equipment-row").count(),
    modelSlots: await mobile.locator(".model-slot").count(),
    bodyWidth: await mobile.evaluate(() => document.body.scrollWidth),
    viewportWidth: await mobile.evaluate(() => window.innerWidth)
  };

  await browser.close();
  server.close();

  console.log(JSON.stringify({ desktop, mobile: mobileResult, routeChecks, errors }, null, 2));

  if (!desktop.title.includes("장비 검색")) throw new Error("Expected search catalog title");
  if (desktop.equipmentRows < 14) throw new Error("Expected expanded equipment rows");
  if (desktop.markers < 6) throw new Error("Expected battlefield markers");
  if (desktop.modelSlots < 1) throw new Error("Expected simplified 3D model slot");
  if (desktop.componentSlots < 1) throw new Error("Expected component spec slots");
  if (desktop.filterSelects !== 4) throw new Error("Expected four catalog filter selects");
  if (desktop.shareButtons !== 1) throw new Error("Expected share search button");
  if (desktop.roleFilteredRows < 1 || desktop.roleFilteredRows >= desktop.equipmentRows) throw new Error("Expected role filter to narrow equipment rows");
  if (!desktop.roleUrlHasParam) throw new Error("Expected role filter in URL");
  if (desktop.reloadedRoleFilteredRows !== desktop.roleFilteredRows) throw new Error("Expected filtered search URL to restore after reload");
  if (!desktop.koreanMapLabels.includes("우크라이나") || !desktop.koreanMapLabels.includes("유럽")) {
    throw new Error("Expected Korean map labels");
  }
  if (mobileResult.modelSlots < 1) throw new Error("Expected mobile model slot");
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
