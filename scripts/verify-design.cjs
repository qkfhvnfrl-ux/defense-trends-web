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
    componentSpecPanels: await desktop.locator(".component-spec-panel").count(),
    trustPills: await desktop.locator(".equipment-row .trust-pill").count(),
    readinessPills: await desktop.locator(".equipment-row .data-readiness-pill").count(),
    sourceQuicklines: await desktop.locator(".equipment-row .source-quickline").count(),
    metricStrips: await desktop.locator(".equipment-row .equipment-metric-strip").count(),
    metricCells: await desktop.locator(".equipment-row .equipment-metric-strip > span").count(),
    filterSelects: await desktop.locator(".filter-grid select").count(),
    presetButtons: await desktop.locator(".catalog-preset-grid button").count(),
    activeFilterBars: await desktop.locator(".active-filter-bar").count(),
    shareButtons: await desktop.locator(".share-search-button").count(),
    resultActionButtons: await desktop.locator(".result-action-grid button").count()
  };

  if (desktopChecks.kpis !== 4) throw new Error("Expected 4 KPI cards");
  if (desktopChecks.searchFields !== 1) throw new Error("Expected equipment search field");
  if (desktopChecks.mapOverlays !== 1) throw new Error("Expected map overlay");
  if (desktopChecks.metaPills < 3) throw new Error("Expected equipment meta pills");
  if (desktopChecks.panelCounters < 1) throw new Error("Expected panel counters");
  if (desktopChecks.componentSpecPanels < 1) throw new Error("Expected component spec panel");
  if (desktopChecks.trustPills < 14) throw new Error("Expected source trust pills in equipment rows");
  if (desktopChecks.readinessPills < 14) throw new Error("Expected data readiness pills in equipment rows");
  if (desktopChecks.sourceQuicklines < 14) throw new Error("Expected source check dates in equipment rows");
  if (desktopChecks.metricStrips < 14) throw new Error("Expected metric strips in equipment rows");
  if (desktopChecks.metricCells < desktopChecks.metricStrips * 4) throw new Error("Expected four metric cells in each equipment row");
  if (desktopChecks.filterSelects !== 8) throw new Error("Expected eight structured catalog filters");
  if (desktopChecks.presetButtons !== 4) throw new Error("Expected four catalog preset buttons");
  if (desktopChecks.activeFilterBars !== 1) throw new Error("Expected active filter summary bar");
  if (desktopChecks.shareButtons !== 1) throw new Error("Expected share search button");
  if (desktopChecks.resultActionButtons !== 2) throw new Error("Expected two result export buttons");

  await desktop.locator(".catalog-preset-grid button").first().click();
  const presetRows = await desktop.locator(".equipment-row").count();
  if (presetRows < 1 || presetRows >= 15) throw new Error(`Expected catalog preset to narrow rows, found ${presetRows}`);
  if (!desktop.url().includes("data=needs-review")) throw new Error("Expected catalog preset to sync into URL");
  await desktop.locator(".active-filter-actions button").first().click();

  await desktop.locator(".filter-grid select").nth(1).selectOption({ label: "독일" });
  const countryFilteredRows = await desktop.locator(".equipment-row").count();
  if (countryFilteredRows < 1 || countryFilteredRows >= 15) throw new Error(`Expected country filter to narrow rows, found ${countryFilteredRows}`);
  if (!desktop.url().includes("country=")) throw new Error("Expected country filter to sync into URL");
  await desktop.getByRole("button", { name: "초기화" }).click();

  await desktop.locator(".filter-grid select").nth(4).selectOption({ label: "Low" });
  const lowConfidenceRows = await desktop.locator(".equipment-row").count();
  if (lowConfidenceRows < 1 || lowConfidenceRows >= 15) throw new Error(`Expected confidence filter to narrow rows, found ${lowConfidenceRows}`);
  if (!desktop.url().includes("confidence=Low")) throw new Error("Expected confidence filter to sync into URL");
  await desktop.getByRole("button", { name: "초기화" }).click();

  await desktop.locator(".filter-grid select").nth(5).selectOption({ label: "사례 있음" });
  const withCaseRows = await desktop.locator(".equipment-row").count();
  if (withCaseRows < 1 || withCaseRows >= 15) throw new Error(`Expected battlefield case filter to narrow rows, found ${withCaseRows}`);
  if (!desktop.url().includes("cases=with-cases")) throw new Error("Expected battlefield case filter to sync into URL");
  await desktop.getByRole("button", { name: "초기화" }).click();

  await desktop.locator(".filter-grid select").nth(6).selectOption({ label: "보강 필요" });
  const needsReviewRows = await desktop.locator(".equipment-row").count();
  if (needsReviewRows < 1 || needsReviewRows >= 15) throw new Error(`Expected data status filter to narrow rows, found ${needsReviewRows}`);
  if (!desktop.url().includes("data=needs-review")) throw new Error("Expected data status filter to sync into URL");
  await desktop.getByRole("button", { name: "초기화" }).click();

  await desktop.locator(".filter-grid select").nth(7).selectOption({ label: "전장 사례 많은순" });
  const sortedFirstRow = await desktop.locator(".equipment-row").first().innerText();
  if (!sortedFirstRow.includes("Boxer")) throw new Error(`Expected battlefield case sort to put Boxer first, found ${sortedFirstRow}`);
  if (!desktop.url().includes("sort=cases-desc")) throw new Error("Expected sort mode to sync into URL");
  await desktop.getByRole("button", { name: "초기화" }).click();

  await desktop.locator(".search-box input").fill("M1A2 Abrams");
  const filteredRows = await desktop.locator(".equipment-row").count();
  if (filteredRows !== 1) throw new Error(`Expected search to narrow to 1 row, found ${filteredRows}`);

  await desktop.goto(new URL("/sources", desktop.url()).href, { waitUntil: "networkidle" });
  await desktop.waitForSelector(".source-filter-bar", { timeout: 15000 });
  const sourceIndex = {
    sourceCards: await desktop.locator(".source-card").count(),
    sourceFilterInputs: await desktop.locator(".source-filter-bar input").count(),
    sourceFilterSelects: await desktop.locator(".source-filter-bar select").count(),
    sourceHealthStats: await desktop.locator(".source-health-strip span").count(),
    sourceActionButtons: await desktop.locator(".source-action-grid button").count()
  };
  await desktop.locator(".source-filter-bar select").first().selectOption({ label: "Official" });
  sourceIndex.officialCards = await desktop.locator(".source-card").count();
  await desktop.locator(".source-filter-bar button").click();
  await desktop.locator(".source-filter-bar input").fill("Rheinmetall");
  sourceIndex.searchFilteredCards = await desktop.locator(".source-card").count();
  if (sourceIndex.sourceCards < 20) throw new Error("Expected source index cards");
  if (sourceIndex.sourceFilterInputs !== 1) throw new Error("Expected source search input");
  if (sourceIndex.sourceFilterSelects !== 2) throw new Error("Expected source filter selects");
  if (sourceIndex.sourceHealthStats !== 3) throw new Error("Expected source health stats");
  if (sourceIndex.sourceActionButtons !== 2) throw new Error("Expected source export action buttons");
  if (sourceIndex.officialCards < 1 || sourceIndex.officialCards >= sourceIndex.sourceCards) throw new Error("Expected source type filter to narrow cards");
  if (sourceIndex.searchFilteredCards < 1 || sourceIndex.searchFilteredCards >= sourceIndex.sourceCards) throw new Error("Expected source search to narrow cards");

  for (const [label, page] of [
    ["desktop", desktop],
    ["tablet", tablet],
    ["mobile", mobile]
  ]) {
    await assertNoHorizontalOverflow(page, label);
  }

  const undersizedControls = await desktop.locator(".equipment-row, .catalog-preset-grid button, .segmented-control button, .filter-grid select, .active-filter-bar button, .share-search-button, .result-action-grid button, .component-slot, .source-filter-bar input, .source-filter-bar select, .source-filter-bar button, .source-action-grid button").evaluateAll((nodes) =>
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

  console.log(JSON.stringify({ desktopChecks, presetRows, countryFilteredRows, lowConfidenceRows, withCaseRows, needsReviewRows, sortedFirstRow, filteredRows, sourceIndex, designTokens: 6 }, null, 2));
}

main().catch((error) => {
  server.close();
  console.error(error);
  process.exit(1);
});
