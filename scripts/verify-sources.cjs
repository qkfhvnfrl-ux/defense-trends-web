const fs = require("fs");
const path = require("path");

const dataDir = path.resolve(__dirname, "..", "public", "data");

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));
}

function collectUrls(value, owner, urls = []) {
  if (!value) return urls;
  if (Array.isArray(value)) {
    value.forEach((item) => collectUrls(item, owner, urls));
    return urls;
  }
  if (typeof value === "object") {
    if (typeof value.url === "string") urls.push({ owner, url: value.url });
    if (Array.isArray(value.sourceUrls)) {
      value.sourceUrls.forEach((url) => urls.push({ owner, url }));
    }
    Object.entries(value).forEach(([key, child]) => {
      if (key !== "url" && key !== "sourceUrls") collectUrls(child, owner, urls);
    });
  }
  return urls;
}

async function probe(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 source-check",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }
    });
    const finalUrl = response.url;
    const lowerFinalUrl = finalUrl.toLowerCase();
    const looksLikeMissingPage =
      lowerFinalUrl.includes("/404") ||
      lowerFinalUrl.includes("404-error-page") ||
      lowerFinalUrl.includes("not-found");
    return {
      ok: !looksLikeMissingPage && (response.ok || response.status === 403 || response.status === 429),
      status: response.status,
      finalUrl,
      contentType: response.headers.get("content-type") || ""
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      finalUrl: url,
      contentType: error.name || "fetch-error"
    };
  } finally {
    clearTimeout(timer);
  }
}

async function runWithConcurrency(items, limit, task) {
  const results = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await task(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function main() {
  const files = fs.readdirSync(dataDir).filter((file) => file.endsWith(".json"));
  const seen = new Map();
  for (const file of files) {
    const data = readJson(file);
    for (const item of data) {
      const owner = `${file}:${item.id || item.name || "unknown"}`;
      for (const entry of collectUrls(item, owner)) {
        const owners = seen.get(entry.url) || [];
        owners.push(entry.owner);
        seen.set(entry.url, owners);
      }
    }
  }

  const entries = [...seen.entries()];
  const results = await runWithConcurrency(entries, 8, async ([url, owners]) => {
    const result = await probe(url);
    return { url, owners, ...result };
  });

  const failed = results.filter((result) => !result.ok);
  console.log(JSON.stringify({ checked: results.length, failed, results }, null, 2));
  if (failed.length) throw new Error(`${failed.length} source URLs failed`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
