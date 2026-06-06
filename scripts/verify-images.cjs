const fs = require("fs");
const path = require("path");

const dataDir = path.resolve(__dirname, "..", "public", "data");

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));
}

async function probe(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "Mozilla/5.0 image-check" }
    });
    const contentType = response.headers.get("content-type") || "";
    return {
      ok: response.status === 429 || (response.ok && contentType.startsWith("image/")),
      rateLimited: response.status === 429,
      status: response.status,
      contentType
    };
  } catch (error) {
    return {
      ok: false,
      rateLimited: false,
      status: 0,
      contentType: error.name || "fetch-error"
    };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const equipment = readJson("equipment.json");
  const technologies = readJson("technologies.json");
  const items = [];

  for (const vehicle of equipment) {
    for (const url of vehicle.images) {
      items.push({ owner: vehicle.id, url });
    }
  }

  for (const technology of technologies) {
    for (const image of technology.images) {
      items.push({ owner: technology.id, url: image.url });
    }
  }

  const failures = [];
  const rateLimited = [];
  for (const item of items) {
    const result = await probe(item.url);
    if (result.rateLimited) {
      rateLimited.push({ ...item, ...result });
      continue;
    }
    if (!result.ok) failures.push({ ...item, ...result });
  }

  console.log(JSON.stringify({ checked: items.length, failures, rateLimited }, null, 2));

  if (failures.length) {
    throw new Error(`${failures.length} image URLs failed`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
