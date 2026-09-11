import { readFileSync, writeFileSync, readdirSync, mkdirSync, renameSync, cpSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const manifest = JSON.parse(readFileSync("releases.json", "utf8"));
const versions = manifest.versions;
if (versions.length > manifest.retention || new Set(versions.map(v => v.id)).size !== versions.length) throw new Error("Version retention/identity mismatch");
if (!versions.some(v => v.id === manifest.baseline) || !versions.some(v => v.id === manifest.current)) throw new Error("Missing baseline or current version");
for (const v of versions) if (!/^v\d+$/.test(v.id)) throw new Error("Invalid version path");
const current = join("dist", "versions", manifest.current);
if (existsSync("dist/versions")) throw new Error("Run a fresh build before packaging versions");
const files = readdirSync("dist");
mkdirSync(current, { recursive: true });
for (const f of files) renameSync(join("dist", f), join(current, f));
for (const v of versions.filter(v => v.id !== manifest.current)) {
  const archive = JSON.parse(readFileSync(`version-archive/${v.id}.json`, "utf8"));
  for (const [path, expected] of Object.entries(archive.files)) {
    const actual = createHash("sha256").update(readFileSync(join("version-archive", v.id, path))).digest("hex");
    if (actual !== expected) throw new Error(`Historical snapshot changed: ${v.id}/${path}`);
  }
  cpSync(join("version-archive", v.id), join("dist", "versions", v.id), { recursive: true });
}
const escape = s => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
for (const v of versions) {
  const dir = join("dist", "versions", v.id);
  let html = readFileSync(join(dir, "index.html"), "utf8");
  if (!html.includes(`/versions/${v.id}/assets/`)) throw new Error(`Wrong asset base for ${v.id}`);
  html = html.replace("<body>", `<body><script>if(location.pathname.endsWith('/')&&!/^\\/versions\\/v[0-9]+\\/$/.test(location.pathname)){history.replaceState(null,'',location.pathname.slice(0,-1)+location.search+location.hash)}</script><nav style="padding:10px 20px;background:#10283d;color:white;font:14px system-ui;display:flex;justify-content:space-between;gap:16px"><span>${escape(v.id)} · ${escape(v.title)} · ${escape(v.status)}</span><a style="color:#d5eaff;white-space:nowrap" href="/">버전 목록</a></nav>`);
  writeFileSync(join(dir, "index.html"), html);
  const equipment = JSON.parse(readFileSync(join(dir, "data/equipment.json"), "utf8"));
  for (const route of ["insights", "sources", "equipment", "compare", "development", "technologies", "cases", ...equipment.map(e => `equipment/${e.id}`)]) {
    mkdirSync(join(dir, route), { recursive: true });
    writeFileSync(join(dir, route, "index.html"), html);
  }
}
writeFileSync("dist/releases.json", JSON.stringify(manifest, null, 2));
writeFileSync("dist/index.html", `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>세계 장비 검색 · 버전 선택</title><style>body{margin:0;background:#eef3f8;color:#142d42;font:16px/1.6 system-ui,sans-serif}main{max-width:1000px;margin:7vh auto;padding:24px}h1{font-size:32px;line-height:1.3}p{color:#52687a}article{padding:24px;background:white;border:1px solid #ccd9e4;border-radius:12px;margin:18px 0}article:first-of-type{border-left:5px solid #236796}h2{margin:8px 0;font-size:22px}.meta{color:#536b7f;font-size:14px}a{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;background:#173e5c;color:white;border-radius:7px;text-decoration:none}a:focus-visible{outline:3px solid #db9e2b;outline-offset:3px}.note{font-size:14px}footer{margin-top:28px}</style></head><body><main><p>개인 검토 공간</p><h1>세계 장비 검색</h1><p>버전마다 고유한 주소로 열립니다. 현재 기준은 ${escape(manifest.baseline)}이며 새 버전은 확인 대기 상태입니다.</p>${versions.map(v => `<article><div class="meta">${escape(v.id)} · ${escape(v.date)} · ${escape(v.status)}</div><h2>${escape(v.title)}</h2><p>${escape(v.summary)}</p><a href="/versions/${v.id}/">${v.id} 열기</a></article>`).join("")}<footer class="note">최근 ${manifest.retention}개 버전을 보관합니다. 이전 버전을 열면 해당 시점의 화면과 자료로 돌아갑니다. 새 버전을 확인한 뒤 기준 버전 변경을 요청해 주세요.</footer></main></body></html>`);
writeFileSync("dist/404.html", '<!doctype html><html lang="ko"><meta charset="utf-8"><title>버전을 찾을 수 없습니다</title><p>보관 중인 버전에서 다시 선택해 주세요.</p><a href="/">버전 목록</a></html>');
console.log(`Packaged ${versions.length} isolated versions; baseline=${manifest.baseline}, review=${manifest.current}`);
