import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { appDataSchema, validateCrossReferences } from "../src/schema.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

const data = {
  equipment: readJson("public/data/equipment.json"),
  incidents: readJson("public/data/incidents.json"),
  trends: readJson("public/data/trends.json"),
  components: readJson("public/data/components.json"),
  variants: readJson("public/data/variants.json"),
  technologies: readJson("public/data/technologies.json"),
  caseStudies: readJson("public/data/battlefieldCases.json"),
  developmentLens: readJson("public/data/developmentLens.json"),
  engineeringReferences: readJson("public/data/engineeringReferences.json")
};

const parsed = appDataSchema.safeParse(data);
if (!parsed.success) {
  console.error(parsed.error.format());
  process.exit(1);
}

const referenceErrors = validateCrossReferences(parsed.data);
if (referenceErrors.length) {
  console.error(referenceErrors.join("\n"));
  process.exit(1);
}

console.log(
  `Validated ${parsed.data.equipment.length} equipment, ${parsed.data.variants.length} variants, ${parsed.data.components.length} components, ${parsed.data.technologies.length} battlefield technologies, ${parsed.data.caseStudies.length} case studies, ${parsed.data.developmentLens.length} development lens items, and ${parsed.data.engineeringReferences.length} engineering references.`
);
