const fs = require("fs");
const path = require("path");

const dataDir = path.resolve(__dirname, "..", "public", "data");
const checkedAt = "2026-06-06";

const replacements = new Map(Object.entries({
  "https://www.gdls.com/products/stryker-family-of-vehicles/": {
    url: "https://www.gdls.com/stryker/",
    title: "General Dynamics Land Systems - Stryker"
  },
  "https://www.army.mil/stryker/": {
    url: "https://www.army.mil/article/207851/anad_gdls_complete_production_of_stryker_dragoons",
    title: "U.S. Army - Stryker Dragoon production"
  },
  "https://www.rheinmetall.com/en/products/tactical-wheeled-vehicles/boxer": {
    url: "https://www.rheinmetall.com/en/products/wheeled-armoured-vehicles/boxer",
    title: "Rheinmetall - Boxer armoured transport vehicle"
  },
  "https://www.knds.com/products/boxer/": {
    url: "https://knds.com/en/products/boxer",
    title: "KNDS - Boxer vehicle family"
  },
  "https://www.knds.fr/en/our-products/vehicles/vbci": {
    url: "https://knds.com/en/press-releases/dimdex-2024-nexter-company-of-knds-offers-the-vbci-to-modernise-the-qatar-infantry-units",
    title: "KNDS - VBCI MkII offer"
  },
  "https://www.knds.fr/en/our-products/vehicles/leclerc-xlr": {
    url: "https://knds.com/media/KRV_041_LECLERC_XLR_EN_BAT_BDEF_6a502524d1.pdf",
    title: "KNDS - Leclerc XLR product sheet"
  },
  "https://www.knds.fr/en/our-products/artillery/caesar": {
    url: "https://knds.com/en/products/systems/caesar-8x8",
    title: "KNDS - CAESAR 8x8"
  },
  "https://www.knds.de/fileadmin/user_upload/fce/PDF/Pressemitteilungen/20240621-KNDS-Press-release-KNDS-armoured-vehicles-firepower-modularity-mobility-and-protection.pdf": {
    url: "https://knds.com/en/press-releases/knds-armoured-vehicles-firepower-modularity-mobility-and-protection",
    title: "KNDS - armoured vehicles firepower and modularity"
  },
  "https://www.patriagroup.com/products-and-services/protected-mobility-and-defence-systems/vehicles/patria-amv-xp": {
    url: "https://www.patriagroup.com/products-and-services/protected-mobility/wheeled-mobility/patria-amv-xp-number-1-in-the-battlefield",
    title: "Patria - AMV XP"
  },
  "https://www.patriagroup.com/products-and-services/protected-mobility-and-defence-systems/vehicles": {
    url: "https://www.patriagroup.com/products-and-services/protected-mobility/wheeled-mobility",
    title: "Patria - wheeled mobility vehicles"
  },
  "https://www.gdls.com/products/abrams-main-battle-tank/": {
    url: "https://www.gdls.com/abrams/",
    title: "General Dynamics Land Systems - Abrams"
  },
  "https://www.knds.com/products/leopard-2/": {
    url: "https://knds.com/en/products/leopard",
    title: "KNDS - Leopard main battle tank family"
  },
  "https://www.rheinmetall.com/en/products/weapon-and-ammunition/tank-systems": {
    url: "https://www.rheinmetall.com/en/products/tracked-armoured-vehicles/main-battle-tank-leopard-trademark-of-knds-deutschland",
    title: "Rheinmetall - Main battle tank Leopard technology"
  },
  "https://www.defense.gouv.fr/terre": {
    url: "https://www.knds.fr/en/our-products/vehicles/vbci",
    title: "KNDS France - VBCI"
  },
  "https://www.defense.gouv.fr/terre/equipements/scorpion": {
    url: "https://www.defense.gouv.fr/eurosatory/the-scorpion-programme",
    title: "French Ministry of Armed Forces - SCORPION programme"
  },
  "https://www.bundeswehr.de/": {
    url: "https://www.rheinmetall.com/en/products/wheeled-armoured-vehicles/boxer",
    title: "Rheinmetall - Boxer operational record"
  },
  "https://www.defense.gouv.fr/operations/operations/afrique/barkhane": {
    url: "https://www.terremag.defense.gouv.fr/nos-reportages/immersion/operation-barkhane-au-revoir-gao",
    title: "TerreMag - Operation Barkhane withdrawal from Gao"
  },
  "https://www.gov.uk/government/news/uk-to-send-squadron-of-challenger-2-tanks-to-ukraine": {
    url: "https://www.gov.uk/government/news/ukrainian-tank-crews-complete-challenger-2-training-in-uk",
    title: "UK Government - Challenger 2 training for Ukraine"
  },
  "https://www.gov.uk/government/news/boxer-armoured-vehicle-programme-boosts-uk-jobs": {
    url: "https://www.gov.uk/government/news/first-british-made-boxer-vehicles-ready-for-army",
    title: "UK Government - First British-made Boxer vehicles"
  },
  "https://rbsl.com/capabilities/challenger-3/": {
    url: "https://www.gov.uk/government/news/uks-most-lethal-tank-rolls-off-the-production-lines",
    title: "UK Government - Challenger 3 production milestone"
  },
  "https://www.army.mod.uk/equipment/challenger-3/": {
    url: "https://www.gov.uk/government/news/british-army-to-possess-most-lethal-tank-in-europe",
    title: "UK Government - Challenger 3 contract and capability"
  },
  "https://www.patriagroup.com/products-and-services/weapon-systems/patria-nemo": {
    url: "https://www.patriagroup.com/products-and-services/defence-and-weapon-systems/armament/patria-nemo",
    title: "Patria - NEMO mortar system"
  },
  "https://www.defense.gov/News/Releases/Release/Article/3265127/biden-administration-announces-additional-security-assistance-for-ukraine/": {
    url: "https://www.war.gov/News/Releases/Release/Article/3272866/biden-administration-announces-additional-security-assistance-for-ukraine/",
    title: "U.S. Department of War - Ukraine security assistance, Jan. 19 2023"
  },
  "https://www.defense.gov/News/Releases/Release/Article/3278813/biden-administration-announces-additional-security-assistance-for-ukraine/": {
    url: "https://www.war.gov/News/Releases/Release/Article/3272866/biden-administration-announces-additional-security-assistance-for-ukraine/",
    title: "U.S. Department of War - Ukraine security assistance, Jan. 19 2023"
  },
  "https://www.defense.gov/News/News-Stories/Article/Article/3278449/us-to-send-31-abrams-tanks-to-ukraine/": {
    url: "https://www.war.gov/News/News-Stories/Article/article/3277910/biden-announces-abrams-tanks-to-be-delivered-to-ukraine/",
    title: "U.S. Department of War - Abrams tanks for Ukraine"
  },
  "https://www.defense.gov/News/Releases/Release/Article/3009153/400-million-in-additional-security-assistance-for-ukraine/": {
    url: "https://www.war.gov/News/Releases/Release/Article/2999113/800-million-in-additional-security-assistance-for-ukraine/",
    title: "U.S. Department of War - M113 armored personnel carriers for Ukraine"
  },
  "https://www.iiss.org/": {
    url: "https://www.bellingcat.com/news/middle-east/2019/04/11/logbook-part-i-the-uaes-bmp-3-ifv-in-yemen/",
    title: "Bellingcat - UAE armored vehicles in Yemen"
  }
}));

function visit(value) {
  if (!value || typeof value !== "object") return;

  if (Array.isArray(value)) {
    value.forEach(visit);
    return;
  }

  if (typeof value.url === "string" && replacements.has(value.url)) {
    const next = replacements.get(value.url);
    value.url = next.url;
    if (typeof value.title === "string") value.title = next.title;
    if (typeof value.checkedAt === "string") value.checkedAt = checkedAt;
  }

  if (Array.isArray(value.sourceUrls)) {
    value.sourceUrls = value.sourceUrls.map((url) => replacements.get(url)?.url || url);
  }

  Object.values(value).forEach(visit);
}

for (const file of fs.readdirSync(dataDir).filter((name) => name.endsWith(".json"))) {
  const fullPath = path.join(dataDir, file);
  const data = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  visit(data);
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`updated ${file}`);
}
