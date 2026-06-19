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
    navButtons: await page.locator(".site-nav button").count(),
    hiddenWholeEquipmentNav: await page.getByRole("button", { name: "전체 장비" }).count(),
    equipmentRows: await page.locator(".equipment-row").count(),
    markers: await page.locator(".case-marker").count(),
    componentSpecPanels: await page.locator(".component-spec-panel").count(),
    componentSlots: await page.locator(".component-slot").count(),
    trustPills: await page.locator(".equipment-row .trust-pill").count(),
    readinessPills: await page.locator(".equipment-row .data-readiness-pill").count(),
    sourceQuicklines: await page.locator(".equipment-row .source-quickline").count(),
    metricStrips: await page.locator(".equipment-row .equipment-metric-strip").count(),
    metricCells: await page.locator(".equipment-row .equipment-metric-strip > span").count(),
    filterSelects: await page.locator(".filter-grid select").count(),
    presetButtons: await page.locator(".catalog-preset-grid button").count(),
    teamQueueButtons: await page.locator(".team-queue-grid button").count(),
    shareButtons: await page.locator(".share-search-button").count(),
    resultActionButtons: await page.locator(".result-action-grid button").count(),
    quickActionButtons: await page.locator(".catalog-summary-panel .quick-action-grid button").count(),
    koreanMapLabels: await page.locator(".korean-region-label").evaluateAll((nodes) =>
      nodes.map((node) => node.textContent?.trim()).filter(Boolean)
    ),
    modalTitle: await page.locator(".component-modal h2").innerText()
  };
  await page.locator(".icon-close").click();
  await page.locator(".team-queue-grid button").nth(1).click();
  await page.waitForSelector(".source-index-page", { timeout: 15000 });
  desktop.sourceQueueUrlHasFreshness = page.url().includes("freshness=stale");
  desktop.sourceQueueCards = await page.locator(".source-card").count();
  desktop.sourceQueueEmptyStates = await page.locator(".source-index-page .empty-state").count();
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.waitForSelector(".equipment-row", { timeout: 15000 });
  await page.locator(".catalog-preset-grid button").first().click();
  desktop.presetNeedsReviewRows = await page.locator(".equipment-row").count();
  desktop.presetFilterTags = await page.locator(".active-filter-tags button").count();
  desktop.presetUrlHasDataParam = page.url().includes("data=needs-review");
  await page.locator(".active-filter-tags button").first().click();
  desktop.presetFilterTagsAfterClear = await page.locator(".active-filter-tags button").count();
  desktop.presetRowsAfterTagClear = await page.locator(".equipment-row").count();
  desktop.presetUrlAfterTagClear = page.url();
  await page.locator(".active-filter-actions button").first().click();
  await page.locator(".filter-grid select").first().selectOption({ label: "대드론/단거리방공" });
  desktop.roleFilteredRows = await page.locator(".equipment-row").count();
  desktop.roleUrlHasParam = page.url().includes("role=");
  await page.reload({ waitUntil: "networkidle" });
  desktop.reloadedRoleFilteredRows = await page.locator(".equipment-row").count();
  await page.getByRole("button", { name: "초기화" }).click();
  await page.locator(".filter-grid select").nth(4).selectOption({ label: "Low" });
  desktop.lowConfidenceRows = await page.locator(".equipment-row").count();
  desktop.confidenceUrlHasParam = page.url().includes("confidence=Low");
  await page.getByRole("button", { name: "초기화" }).click();
  await page.locator(".filter-grid select").nth(5).selectOption({ label: "사례 있음" });
  desktop.withCaseRows = await page.locator(".equipment-row").count();
  desktop.casesUrlHasParam = page.url().includes("cases=with-cases");
  await page.getByRole("button", { name: "초기화" }).click();
  await page.locator(".filter-grid select").nth(6).selectOption({ label: "보강 필요" });
  desktop.needsReviewRows = await page.locator(".equipment-row").count();
  desktop.dataStatusUrlHasParam = page.url().includes("data=needs-review");
  await page.getByRole("button", { name: "초기화" }).click();
  await page.locator(".filter-grid select").nth(7).selectOption({ label: "전장 사례 많은순" });
  desktop.sortedFirstRow = await page.locator(".equipment-row").first().innerText();
  desktop.sortUrlHasParam = page.url().includes("sort=cases-desc");
  await page.getByRole("button", { name: "초기화" }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "CSV 다운로드" }).click();
  const download = await downloadPromise;
  desktop.csvSuggestedFilename = download.suggestedFilename();

  const routeChecks = [];
  for (const route of ["/", "/equipment", "/equipment/m2a2-bradley", "/insights", "/sources", "/development", "/compare", "/technologies", "/cases"]) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    const rootLength = await page.locator("#root").evaluate((node) => node.innerHTML.length);
    const hasHeading = await page.locator("h1, h2").first().isVisible();
    const finalPath = new URL(page.url()).pathname;
    routeChecks.push({ route, finalPath, rootLength, hasHeading });
  }

  await page.goto(`${baseUrl}/sources`, { waitUntil: "networkidle" });
  await page.waitForSelector(".source-filter-bar", { timeout: 15000 });
  const sourceIndex = {
    sourceCards: await page.locator(".source-card").count(),
    sourceFilterInputs: await page.locator(".source-filter-bar input").count(),
    sourceFilterSelects: await page.locator(".source-filter-bar select").count(),
    sourceHealthStats: await page.locator(".source-health-strip span").count(),
    sourceActionButtons: await page.locator(".source-action-grid button").count()
  };
  await page.locator(".source-filter-bar select").first().selectOption({ label: "Official" });
  sourceIndex.officialCards = await page.locator(".source-card").count();
  await page.locator(".source-filter-bar button").click();
  await page.locator(".source-filter-bar input").fill("Rheinmetall");
  sourceIndex.searchFilteredCards = await page.locator(".source-card").count();
  const sourceDownloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "출처 CSV 다운로드" }).click();
  const sourceDownload = await sourceDownloadPromise;
  sourceIndex.csvSuggestedFilename = sourceDownload.suggestedFilename();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 900 } });
  await mobile.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await mobile.waitForSelector(".equipment-row", { timeout: 15000 });

  const mobileResult = {
    equipmentRows: await mobile.locator(".equipment-row").count(),
    componentSpecPanels: await mobile.locator(".component-spec-panel").count(),
    bodyWidth: await mobile.evaluate(() => document.body.scrollWidth),
    viewportWidth: await mobile.evaluate(() => window.innerWidth)
  };

  await browser.close();
  server.close();

  console.log(JSON.stringify({ desktop, mobile: mobileResult, sourceIndex, routeChecks, errors }, null, 2));

  if (!desktop.title.includes("장비 검색")) throw new Error("Expected search catalog title");
  if (desktop.navButtons !== 3) throw new Error("Expected three primary navigation buttons");
  if (desktop.hiddenWholeEquipmentNav !== 0) throw new Error("Expected duplicate whole equipment navigation to be hidden");
  if (desktop.equipmentRows < 14) throw new Error("Expected expanded equipment rows");
  if (desktop.markers < 6) throw new Error("Expected battlefield markers");
  if (desktop.componentSpecPanels < 1) throw new Error("Expected component spec panel");
  if (desktop.componentSlots < 1) throw new Error("Expected component spec slots");
  if (desktop.trustPills !== desktop.equipmentRows) throw new Error("Expected one source trust pill per equipment row");
  if (desktop.readinessPills !== desktop.equipmentRows) throw new Error("Expected one data readiness pill per equipment row");
  if (desktop.sourceQuicklines !== desktop.equipmentRows) throw new Error("Expected one source check line per equipment row");
  if (desktop.metricStrips !== desktop.equipmentRows) throw new Error("Expected one metric strip per equipment row");
  if (desktop.metricCells !== desktop.equipmentRows * 4) throw new Error("Expected four metric cells per equipment row");
  if (desktop.filterSelects !== 8) throw new Error("Expected eight catalog filter selects");
  if (desktop.presetButtons !== 4) throw new Error("Expected four catalog preset buttons");
  if (desktop.teamQueueButtons !== 4) throw new Error("Expected four team queue buttons");
  if (desktop.shareButtons !== 1) throw new Error("Expected share search button");
  if (desktop.resultActionButtons !== 2) throw new Error("Expected result export actions");
  if (desktop.quickActionButtons !== 2) throw new Error("Expected two selected equipment quick actions");
  if (!desktop.sourceQueueUrlHasFreshness) throw new Error("Expected source review queue to open stale source filter");
  if (desktop.sourceQueueCards < 1 && desktop.sourceQueueEmptyStates < 1) throw new Error("Expected source review queue to show cards or an empty state");
  if (desktop.presetNeedsReviewRows < 1 || desktop.presetNeedsReviewRows >= desktop.equipmentRows) throw new Error("Expected preset to narrow equipment rows");
  if (desktop.presetFilterTags < 1) throw new Error("Expected active filter tags after applying a preset");
  if (!desktop.presetUrlHasDataParam) throw new Error("Expected preset to sync data status into URL");
  if (desktop.presetFilterTagsAfterClear !== 0) throw new Error("Expected filter tag click to clear the preset condition");
  if (desktop.presetRowsAfterTagClear !== desktop.equipmentRows) throw new Error("Expected filter tag click to restore all equipment rows");
  if (desktop.presetUrlAfterTagClear.includes("data=needs-review")) throw new Error("Expected filter tag click to remove data status from URL");
  if (desktop.roleFilteredRows < 1 || desktop.roleFilteredRows >= desktop.equipmentRows) throw new Error("Expected role filter to narrow equipment rows");
  if (!desktop.roleUrlHasParam) throw new Error("Expected role filter in URL");
  if (desktop.reloadedRoleFilteredRows !== desktop.roleFilteredRows) throw new Error("Expected filtered search URL to restore after reload");
  if (desktop.lowConfidenceRows < 1 || desktop.lowConfidenceRows >= desktop.equipmentRows) throw new Error("Expected confidence filter to narrow equipment rows");
  if (!desktop.confidenceUrlHasParam) throw new Error("Expected confidence filter in URL");
  if (desktop.withCaseRows < 1 || desktop.withCaseRows >= desktop.equipmentRows) throw new Error("Expected battlefield case filter to narrow equipment rows");
  if (!desktop.casesUrlHasParam) throw new Error("Expected battlefield case filter in URL");
  if (desktop.needsReviewRows < 1 || desktop.needsReviewRows >= desktop.equipmentRows) throw new Error("Expected data status filter to narrow equipment rows");
  if (!desktop.dataStatusUrlHasParam) throw new Error("Expected data status filter in URL");
  if (!desktop.sortedFirstRow.includes("Boxer")) throw new Error("Expected battlefield case sort to put Boxer first");
  if (!desktop.sortUrlHasParam) throw new Error("Expected sort mode in URL");
  if (desktop.csvSuggestedFilename !== "equipment-search-results.csv") throw new Error("Expected CSV download filename");
  if (sourceIndex.sourceCards < 20) throw new Error("Expected source index cards");
  if (sourceIndex.sourceFilterInputs !== 1) throw new Error("Expected source search input");
  if (sourceIndex.sourceFilterSelects !== 2) throw new Error("Expected source filter selects");
  if (sourceIndex.sourceHealthStats !== 3) throw new Error("Expected source health stats");
  if (sourceIndex.sourceActionButtons !== 2) throw new Error("Expected source export action buttons");
  if (sourceIndex.officialCards < 1 || sourceIndex.officialCards >= sourceIndex.sourceCards) throw new Error("Expected source type filter to narrow cards");
  if (sourceIndex.searchFilteredCards < 1 || sourceIndex.searchFilteredCards >= sourceIndex.sourceCards) throw new Error("Expected source search to narrow cards");
  if (sourceIndex.csvSuggestedFilename !== "source-index-results.csv") throw new Error("Expected source CSV download filename");
  if (!desktop.koreanMapLabels.includes("우크라이나") || !desktop.koreanMapLabels.includes("유럽")) {
    throw new Error("Expected Korean map labels");
  }
  if (mobileResult.componentSpecPanels < 1) throw new Error("Expected mobile component spec panel");
  if (mobileResult.bodyWidth > mobileResult.viewportWidth + 1) throw new Error("Mobile layout has horizontal overflow");
  for (const route of routeChecks) {
    if (route.rootLength < 1000 || !route.hasHeading) throw new Error(`Route ${route.route} did not render correctly`);
    const canonicalRoutes = {
      "/compare": "/",
      "/development": "/insights",
      "/technologies": "/insights",
      "/cases": "/insights"
    };
    const expectedFinalPath = canonicalRoutes[route.route] ?? route.route;
    if (route.finalPath !== expectedFinalPath) {
      throw new Error(`Route ${route.route} ended at ${route.finalPath}, expected ${expectedFinalPath}`);
    }
  }
  if (errors.length) throw new Error(`Browser errors: ${errors.join("; ")}`);
}

main().catch((error) => {
  server.close();
  console.error(error);
  process.exit(1);
});
