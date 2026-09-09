import type { Equipment, EquipmentVariant } from "./types";

function normalizeSearchText(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\u2010-\u2015\u2212-]/g, "")
    .replace(/(\d)\s*[x×]\s*(?=\d)/g, "$1x");
}

export function matchesEquipmentQuery(
  equipment: Equipment,
  variants: EquipmentVariant[],
  query: string,
  categoryLabel: string
) {
  const terms = normalizeSearchText(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return true;

  const fields = [
    equipment.name,
    ...equipment.aliases,
    categoryLabel,
    equipment.country,
    equipment.originCountry,
    ...equipment.operatorCountries,
    equipment.manufacturer,
    ...equipment.roleTags,
    equipment.status,
    equipment.summaryKo,
    ...variants.flatMap((variant) => [
      variant.nameKo,
      variant.role,
      variant.armament,
      variant.maturity
    ])
  ].map((field) => normalizeSearchText(field).replace(/\s+/g, ""));

  // Every term must match, while allowing terms to occur in different fields.
  return terms.every((term) => fields.some((field) => field.includes(term)));
}
