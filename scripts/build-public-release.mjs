import { readFileSync, writeFileSync, mkdirSync, readdirSync, cpSync, rmSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";

const release = JSON.parse(readFileSync("releases.json", "utf8"));
if (release.current !== release.baseline || !/^v\d+$/.test(release.current)) throw new Error("Approve the current release before publishing");
if (release.versions.length > release.retention) throw new Error("Too many retained versions");
const root = "/defense-trends-web/";
const base = `${root}versions/${release.current}/`;
const output = `dist-public/versions/${release.current}`;
rmSync("dist-public", { recursive: true, force: true });
for (const args of [["node_modules/typescript/bin/tsc", "-b"], ["node_modules/vite/bin/vite.js", "build", "--outDir", output, "--emptyOutDir"]]) {
  const result = spawnSync(process.execPath, args, { stdio: "inherit", env: { ...process.env, SITE_VERSION_BASE: base } });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
function files(dir) { return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(join(dir,e.name)) : [join(dir,e.name)]); }
for (const version of release.versions) {
  if (!/^v\d+$/.test(version.id)) throw new Error("Invalid version");
  const dir = `dist-public/versions/${version.id}`;
  const versionBase = `${root}versions/${version.id}/`;
  if (version.id !== release.current) {
    const archive = `version-archive/${version.id}`;
    const checks = JSON.parse(readFileSync(`${archive}.json`, "utf8"));
    for (const [path, expected] of Object.entries(checks.files)) {
      if (createHash("sha256").update(readFileSync(join(archive,path))).digest("hex") !== expected) throw new Error(`Snapshot changed: ${version.id}/${path}`);
    }
    cpSync(archive,dir,{recursive:true});
    for (const path of files(dir).filter(p=>/\.(html|js|css)$/.test(p))) {
      let text = readFileSync(path,"utf8");
      // Archive bundles use a private-site base. Only adapt their known base prefix.
      text = text.replaceAll(`/versions/${version.id}/`,versionBase).replaceAll(`"/versions/${version.id}"`,`"${versionBase.slice(0,-1)}"`);
      writeFileSync(path,text);
    }
  }
  let html = readFileSync(join(dir,"index.html"),"utf8");
  if (!html.includes(`${versionBase}assets/`)) throw new Error(`Wrong asset base: ${version.id}`);
  html = html.replace("<body>",`<body><script>if(location.pathname.endsWith('/')&&location.pathname!==${JSON.stringify(versionBase)}){history.replaceState(null,'',location.pathname.slice(0,-1)+location.search+location.hash)}</script><nav style="padding:10px 20px;background:#10283d;color:white;font:14px system-ui"><strong>${version.id}</strong> · <a style="color:white" href="${root}versions/">버전 목록</a></nav>`);
  writeFileSync(join(dir,"index.html"),html);
  const equipment = JSON.parse(readFileSync(join(dir,"data/equipment.json"),"utf8"));
  for (const route of ["insights","sources","equipment","compare","development","technologies","cases",...equipment.map(e=>`equipment/${e.id}`)]) {
    mkdirSync(join(dir,route),{recursive:true});writeFileSync(join(dir,route,"index.html"),html);
  }
}
const redirect = `<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>세계 장비 검색</title><script>const root=${JSON.stringify(root)},base=${JSON.stringify(base)};const suffix=location.pathname.startsWith(root)?location.pathname.slice(root.length):'';if(!suffix.startsWith('versions/'))location.replace(base+(suffix==='index.html'?'':suffix)+location.search+location.hash);</script><p>세계 장비 검색 ${release.current}</p><a href="${base}">사이트 열기</a> · <a href="${root}versions/">버전 목록</a></html>`;
writeFileSync("dist-public/index.html",redirect);writeFileSync("dist-public/404.html",redirect);writeFileSync("dist-public/.nojekyll","");
writeFileSync("dist-public/versions/index.html",`<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>세계 장비 검색 · 버전 목록</title><style>body{font:16px/1.6 system-ui;background:#eef3f8;color:#142d42;margin:0}main{max-width:900px;margin:5vh auto;padding:24px}article{background:white;border:1px solid #cbd8e3;border-radius:12px;padding:20px;margin:16px 0}a{color:#165c8d}h1{font-size:28px}</style><main><h1>세계 장비 검색 · 버전 목록</h1><p>현재 공개 기준 ${release.current} · 최근 ${release.retention}개 버전</p>${release.versions.map(v=>`<article><h2><a href="${root}versions/${v.id}/">${v.id} · ${v.title}</a></h2><p>${v.summary}</p><small>${v.date} · ${v.status}</small></article>`).join("")}<a href="https://github.com/qkfhvnfrl-ux/defense-trends-web">GitHub 소스와 변경 이력 ↗</a></main></html>`);
writeFileSync("dist-public/releases.json",JSON.stringify(release,null,2));
console.log(`Public versions ready: ${release.versions.map(v=>v.id).join(', ')}`);
