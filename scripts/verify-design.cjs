const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const { server } = require("./serve-dist.cjs");

async function openApp(browser, viewport) {
  const page = await browser.newPage({ viewport });
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.waitForSelector(".app-shell", { timeout: 15000 });
  return page;
}

async function assertNoHorizontalOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    bodyWidth: document.body.scrollWidth,
    viewportWidth: window.innerWidth
  }));
  if (dimensions.bodyWidth > dimensions.viewportWidth + 1) {
    throw new Error(`${label} has horizontal overflow: ${dimensions.bodyWidth}px > ${dimensions.viewportWidth}px`);
  }
}

async function main() {
  const css = fs.readFileSync(path.resolve(__dirname, "..", "src", "styles.css"), "utf8");
  for (const token of ["--green:", "--red:", "--amber:", "--blue:", "--surface:", "--line:"]) {
    if (!css.includes(token)) throw new Error(`Missing design token ${token}`);
  }

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const browser = await chromium.launch({ headless: true });

  const desktop = await openApp(browser, { width: 1440, height: 1000 });
  const mobile = await openApp(browser, { width: 390, height: 900 });
  const tablet = await openApp(browser, { width: 820, height: 1100 });

  const desktopChecks = {
    kpis: await desktop.locator(".kpi-strip div").count(),
    searchFields: await desktop.locator(".search-box input").count(),
    mapOverlays: await desktop.locator(".map-overlay").count(),
    metaPills: await desktop.locator(".meta-row span").count(),
    panelCounters: await desktop.locator(".panel-title span").count(),
    modelSlots: await desktop.locator(".model-slot").count(),
    filterSelects: await desktop.locator(".filter-grid select").count(),
    activeFilterBars: await desktop.locator(".active-filter-bar").count()
  };

  if (desktopChecks.kpis !== 4) throw new Error("Expected 4 KPI cards");
  if (desktopChecks.searchFields !== 1) throw new Error("Expected equipment search field");
  if (desktopChecks.mapOverlays !== 1) throw new Error("Expected map overlay");
  if (desktopChecks.metaPills < 3) throw new Error("Expected equipment meta pills");
  if (desktopChecks.panelCounters < 1) throw new Error("Expected panel counters");
  if (desktopChecks.modelSlots < 1) throw new Error("Expected simplified model slot");
  if (desktopChecks.filterSelects !== 4) throw new Error("Expected four structured catalog filters");
  if (desktopChecks.activeFilterBars !== 1) throw new Error("Expected active filter summary bar");

  await desktop.locator(".filter-grid select").nth(1).selectOption({ label: "독일" });
  const countryFilteredRows = await desktop.locator(".equipment-row").count();
  if (countryFilteredRows < 1 || countryFilteredRows >= 15) throw new Error(`Expected country filter to narrow rows, found ${countryFilteredRows}`);
  await desktop.locator(".active-filter-bar button").click();

  await desktop.locator(".search-box input").fill("M1A2 Abrams");
  const filteredRows = await desktop.locator(".equipment-row").count();
  if (filteredRows !== 1) throw new Error(`Expected search to narrow to 1 row, found ${filteredRows}`);

  for (const [label, page] of [
    ["desktop", desktop],
    ["tablet", tablet],
    ["mobile", mobile]
  ]) {
    await assertNoHorizontalOverflow(page, label);
  }

  const undersizedControls = await desktop.locator(".equipment-row, .segmented-control button, .filter-grid select, .active-filter-bar button, .component-slot").evaluateAll((nodes) =>
    nodes
      .map((node) => {
        const rect = node.getBoundingClientRect();
        return { text: node.textContent?.trim(), width: rect.width, height: rect.height };
      })
      .filter((item) => item.width < 32 || item.height < 32)
  );
  if (undersizedControls.length) {
    throw new Error(`Undersized controls: ${JSON.stringify(undersizedControls)}`);
  }

  await browser.close();
  server.close();

  console.log(JSON.stringify({ desktopChecks, countryFilteredRows, filteredRows, designTokens: 6 }, null, 2));
}

main().catch((error) => {
  server.close();
  console.error(error);
  process.exit(1);
});
