import type {
  AiAnomalyType,
  AiRecommendationAction,
  AiRecommendationPriority,
  AiTrend,
} from "@/types/ai";
import type { StorageCondition } from "@/types/inventory";
import type { RiskLevel } from "@/types/api";

export const STORAGE_LABELS: Record<StorageCondition, string> = {
  room_temperature: "Комнатная 15–25°C",
  cool: "Прохладно 8–15°C",
  refrigerated: "Холодильник 2–8°C",
  frozen: "Заморозка ≤ −18°C",
  controlled: "Особый контроль",
};

export const RISK_LABELS: Record<RiskLevel, string> = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
  critical: "Критический",
};

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

export const TREND_LABELS: Record<AiTrend, string> = {
  declining: "Снижается",
  stable: "Стабильный",
  growing: "Растёт",
};

export const ANOMALY_LABELS: Record<AiAnomalyType, string> = {
  spike: "Резкий рост",
  drop: "Резкое падение",
  writeoff: "Списание",
  supply_gap: "Сбой поставки",
};

export const PRIORITY_TONE: Record<
  AiRecommendationPriority,
  "neutral" | "warning" | "danger"
> = {
  low: "neutral",
  medium: "neutral",
  high: "warning",
  urgent: "danger",
};

export const RUN_STATUS_LABELS: Record<
  "pending" | "success" | "error" | "missing",
  string
> = {
  pending: "Выполняется",
  success: "Успех",
  error: "Ошибка",
  missing: "Не запускался",
};
