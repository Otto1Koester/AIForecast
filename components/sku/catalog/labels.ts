import { formatUnitRu } from "@/lib/utils/format";
import type { AiRecommendationAction, AiRecommendationPriority } from "@/types/ai";
import type { StorageCondition } from "@/types/inventory";
import type { RiskLevel } from "@/types/api";

export const STORAGE_LABELS: Record<StorageCondition, string> = {
  room_temperature: "Комнатная 15–25°C",
  cool: "Прохладно 8–15°C",
  refrigerated: "Холодильник 2–8°C",
  frozen: "Заморозка ≤ −18°C",
  controlled: "Особый контроль",
};

export const STORAGE_OPTIONS: ReadonlyArray<{
  value: StorageCondition;
  label: string;
}> = [
  { value: "room_temperature", label: STORAGE_LABELS.room_temperature },
  { value: "cool", label: STORAGE_LABELS.cool },
  { value: "refrigerated", label: STORAGE_LABELS.refrigerated },
  { value: "frozen", label: STORAGE_LABELS.frozen },
  { value: "controlled", label: STORAGE_LABELS.controlled },
];

export const RISK_LABELS: Record<RiskLevel, string> = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
  critical: "Критический",
};

export const RISK_OPTIONS: ReadonlyArray<{ value: RiskLevel; label: string }> = [
  { value: "low", label: RISK_LABELS.low },
  { value: "medium", label: RISK_LABELS.medium },
  { value: "high", label: RISK_LABELS.high },
  { value: "critical", label: RISK_LABELS.critical },
];

export const ABC_LABELS: Record<"A" | "B" | "C", string> = {
  A: "A — высокий вклад",
  B: "B — средний вклад",
  C: "C — низкий вклад",
};

export const ACTION_LABELS: Record<AiRecommendationAction, string> = {
  reorder: "Заказать",
  accelerate_sales: "Ускорить продажи",
  write_off: "Списать",
  monitor: "Мониторить",
  adjust_safety_stock: "Скорректировать резерв",
};

export const PRIORITY_LABELS: Record<AiRecommendationPriority, string> = {
  low: "низкий",
  medium: "средний",
  high: "высокий",
  urgent: "срочно",
};

const numberFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 1,
});

const currencyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatInteger(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }
  return numberFormatter.format(Math.round(value));
}

export function formatDecimal(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }
  return decimalFormatter.format(value);
}

export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }
  return currencyFormatter.format(value);
}

export function formatStockWithUnit(
  value: number | null | undefined,
  unit: string,
): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }
  return `${numberFormatter.format(Math.round(value))} ${formatUnitRu(unit)}`;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) {
    return "—";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return dateFormatter.format(date);
}
