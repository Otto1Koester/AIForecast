// CBR official USD/RUB rate for 2026-04-29. Used for demo UI currency conversion.
export const USD_TO_RUB_RATE = 74.6947;

const rubCurrencyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

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

function toFiniteNumber(value: number | null | undefined): number {
  const safeValue = Number(value ?? 0);
  return Number.isFinite(safeValue) ? safeValue : 0;
}

export function convertUsdToRub(valueUsd: number | null | undefined): number {
  return toFiniteNumber(valueUsd) * USD_TO_RUB_RATE;
}

export function formatRubFromUsd(valueUsd: number | null | undefined): string {
  return rubCurrencyFormatter.format(convertUsdToRub(valueUsd));
}

export function formatRub(valueRub: number | null | undefined): string {
  return rubCurrencyFormatter.format(toFiniteNumber(valueRub));
}
