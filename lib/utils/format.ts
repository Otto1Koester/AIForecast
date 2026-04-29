const UNIT_LABELS_RU: Record<string, string> = {
  syringe: "шприц",
  pen: "ручка",
  pack: "упак.",
  tablet: "табл.",
  capsule: "капс.",
  vial: "флак.",
  ampoule: "амп.",
  bottle: "фл.",
  dose: "доза",
  unit: "ед.",
};

export function formatUnitRu(unit: string): string {
  if (!unit) {
    return "";
  }
  const key = unit.toLowerCase();
  return UNIT_LABELS_RU[key] ?? unit;
}
