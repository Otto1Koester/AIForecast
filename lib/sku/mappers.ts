import type {
  LatestAiForecastSummary,
  RecommendationSummary,
  RiskSummary,
  SkuAiTechnicalMetadata,
  SkuDetailHeader,
  SkuLatestAiForecast,
  SkuListItem,
  SkuLotDto,
  SkuMovementDto,
  SkuReorderInfo,
} from "@/types/api";
import type {
  AiForecastAnalysis,
  AiForecastRunStatus,
  AiRecommendation,
  AiRiskLevel,
} from "@/types/ai";
import type {
  InventoryLot,
  InventoryMovement,
  SkuItem,
  StorageCondition,
} from "@/types/inventory";
import {
  RISK_LEVELS,
  STORAGE_CONDITIONS,
  type AiForecastRow,
  type AiForecastRunRow,
  type InventoryLotRow,
  type InventoryMovementRow,
  type NumericValue,
  type SkuComputedMetrics,
  type SkuItemRow,
} from "@/lib/sku/types";
import { calculateDaysToExpiry } from "@/lib/sku/metrics";

export function toNumber(value: NumericValue | null | undefined): number {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

export function roundTo(value: number, digits = 2): number {
  const multiplier = 10 ** digits;
  return Math.round((value + Number.EPSILON) * multiplier) / multiplier;
}

function toStorageCondition(value: string): StorageCondition {
  if ((STORAGE_CONDITIONS as readonly string[]).includes(value)) {
    return value as StorageCondition;
  }

  return "room_temperature";
}

export function toRiskLevel(value: string): AiRiskLevel {
  if ((RISK_LEVELS as readonly string[]).includes(value)) {
    return value as AiRiskLevel;
  }

  return "low";
}

export function mapSkuRow(row: SkuItemRow): SkuItem {
  return {
    id: row.id,
    name: row.name,
    dosageForm: row.dosage_form,
    category: row.category,
    storageCondition: toStorageCondition(row.storage_condition),
    shelfLifeDays: row.shelf_life_days,
    currentStock: toNumber(row.current_stock),
    unit: row.unit,
    unitCost: toNumber(row.unit_cost),
    orderCost: toNumber(row.order_cost),
    holdingCostRate: toNumber(row.holding_cost_rate),
    leadTimeDays: row.lead_time_days,
    serviceLevel: toNumber(row.service_level),
    supplier: row.supplier,
    createdAt: row.created_at,
  };
}

export function mapInventoryLotRow(row: InventoryLotRow): InventoryLot {
  return {
    id: row.id,
    skuId: row.sku_id,
    lotNumber: row.lot_number,
    quantity: toNumber(row.quantity),
    receivedAt: row.received_at,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  };
}

export function mapInventoryMovementRow(
  row: InventoryMovementRow,
): InventoryMovement {
  return {
    id: row.id,
    skuId: row.sku_id,
    periodMonth: row.period_month,
    inboundQty: toNumber(row.inbound_qty),
    outboundQty: toNumber(row.outbound_qty),
    writeoffQty: toNumber(row.writeoff_qty),
    endingStock: toNumber(row.ending_stock),
    anomalyFlag: row.anomaly_flag ?? false,
    anomalyNote: row.anomaly_note,
    createdAt: row.created_at,
  };
}

export function mapForecastSummary(
  forecast: AiForecastRow,
): LatestAiForecastSummary {
  return {
    forecastId: forecast.id,
    model: forecast.model,
    createdAt: forecast.created_at,
    confidence: forecast.confidence === null ? null : toNumber(forecast.confidence),
    forecast1m: toNumber(forecast.forecast_1m),
    forecast3m: toNumber(forecast.forecast_3m),
    forecast6m: toNumber(forecast.forecast_6m),
    trend: forecast.analysis.forecast.trend,
  };
}

export function mapRecommendationSummary(
  recommendation: AiRecommendation,
): RecommendationSummary {
  return {
    action: recommendation.action,
    priority: recommendation.priority,
    suggestedQuantity: recommendation.suggestedQuantity,
    deadlineDays: recommendation.deadlineDays,
    reasoning: recommendation.reasoning,
  };
}

export function mapRiskSummary(forecast: AiForecastRow): RiskSummary {
  return {
    stockout: toRiskLevel(forecast.stockout_risk),
    overstock: toRiskLevel(forecast.overstock_risk),
    expiry: toRiskLevel(forecast.expiry_risk),
  };
}

export function mapSkuListItem(
  sku: SkuItem,
  metrics: SkuComputedMetrics,
  forecast: AiForecastRow | undefined,
): SkuListItem {
  const primaryRecommendation =
    forecast?.analysis.recommendations[0] !== undefined
      ? mapRecommendationSummary(forecast.analysis.recommendations[0])
      : null;

  return {
    id: sku.id,
    name: sku.name,
    dosageForm: sku.dosageForm,
    category: sku.category,
    storageCondition: sku.storageCondition,
    shelfLifeDays: sku.shelfLifeDays,
    currentStock: sku.currentStock,
    unit: sku.unit,
    unitCost: sku.unitCost,
    inventoryValue: metrics.inventoryValue,
    daysCoverage: metrics.daysCoverage,
    abcClass: metrics.abcClass,
    rop: forecast ? toNumber(forecast.rop) : null,
    eoq: forecast ? toNumber(forecast.eoq) : null,
    stockoutRisk: forecast ? toRiskLevel(forecast.stockout_risk) : null,
    overstockRisk: forecast ? toRiskLevel(forecast.overstock_risk) : null,
    expiryRisk: forecast ? toRiskLevel(forecast.expiry_risk) : null,
    primaryRecommendation,
    latestForecastCreatedAt: forecast?.created_at ?? null,
  };
}

export function mapSkuDetailHeader(
  sku: SkuItem,
  metrics: SkuComputedMetrics,
): SkuDetailHeader {
  return {
    id: sku.id,
    name: sku.name,
    dosageForm: sku.dosageForm,
    category: sku.category,
    storageCondition: sku.storageCondition,
    shelfLifeDays: sku.shelfLifeDays,
    unit: sku.unit,
    unitCost: sku.unitCost,
    orderCost: sku.orderCost,
    holdingCostRate: sku.holdingCostRate,
    leadTimeDays: sku.leadTimeDays,
    serviceLevel: sku.serviceLevel,
    supplier: sku.supplier,
    abcClass: metrics.abcClass,
  };
}

export function mapSkuLotDto(lot: InventoryLot): SkuLotDto {
  const daysToExpiry = calculateDaysToExpiry(lot.expiresAt);

  return {
    ...lot,
    daysToExpiry,
    isExpired: daysToExpiry !== null && daysToExpiry < 0,
  };
}

export function mapSkuMovementDto(
  movement: InventoryMovement,
): SkuMovementDto {
  return movement;
}

export function mapReorderInfo(
  forecast: AiForecastRow | undefined,
): SkuReorderInfo {
  if (!forecast) {
    return {
      rop: null,
      eoq: null,
      safetyStock: null,
      leadTimeDemand: null,
      explanation: "AI-прогноз ещё не рассчитан.",
    };
  }

  return {
    rop: toNumber(forecast.rop),
    eoq: toNumber(forecast.eoq),
    safetyStock: forecast.analysis.reorder.safetyStock,
    leadTimeDemand: forecast.analysis.reorder.leadTimeDemand,
    explanation: forecast.analysis.reorder.explanation,
  };
}

export function mapLatestAiForecast(
  forecast: AiForecastRow | undefined,
): SkuLatestAiForecast | null {
  if (!forecast) {
    return null;
  }

  return {
    summary: mapForecastSummary(forecast),
    analysis: forecast.analysis,
    recommendations: forecast.analysis.recommendations,
  };
}

export function mapAiMetadata(
  forecast: AiForecastRow | undefined,
  run: AiForecastRunRow | undefined,
): SkuAiTechnicalMetadata {
  if (!forecast) {
    return {
      forecastId: null,
      runId: run?.id ?? null,
      model: run?.model ?? null,
      inputHash: run?.input_hash ?? null,
      status: run?.status ?? "missing",
      errorMessage:
        run?.error_message ?? "AI-прогноз ещё не рассчитан.",
      createdAt: run?.created_at ?? null,
      finishedAt: run?.finished_at ?? null,
    };
  }

  return {
    forecastId: forecast.id,
    runId: run?.id ?? null,
    model: forecast.model,
    inputHash: forecast.input_hash,
    status: "success" as AiForecastRunStatus,
    errorMessage: null,
    createdAt: forecast.created_at,
    finishedAt: run?.finished_at ?? forecast.created_at,
  };
}

export function normalizeForecastAnalysis(
  value: unknown,
): AiForecastAnalysis {
  return value as AiForecastAnalysis;
}
