import { createHash } from "node:crypto";

import { fetchSkuDetailData } from "@/lib/sku/queries";
import {
  calculateDaysCoverage,
  calculateDaysToExpiry,
  calculateQuantityAtRiskByExpiry,
} from "@/lib/sku/metrics";
import { roundTo } from "@/lib/sku/mappers";
import type {
  AiForecastAnalysis,
  AiRiskLevel,
  AiTrend,
} from "@/types/ai";
import type { InventoryLot, InventoryMovement, SkuItem } from "@/types/inventory";

export class SkuNotFoundError extends Error {
  constructor(skuId: string) {
    super(`SKU not found: ${skuId}`);
    this.name = "SkuNotFoundError";
  }
}

type SkuPassportContext = {
  id: string;
  name: string;
  dosageForm: string;
  category: string;
  storageCondition: string;
  shelfLifeDays: number;
  unit: string;
  supplier: string;
};

type CostsContext = {
  unitCost: number;
  orderCost: number;
  holdingCostRate: number;
};

type LotContext = {
  lotNumber: string;
  quantity: number;
  receivedAt: string;
  expiresAt: string;
  daysToExpiry: number | null;
};

type MovementContext = {
  periodMonth: string;
  inboundQty: number;
  outboundQty: number;
  writeoffQty: number;
  endingStock: number;
  anomalyFlag: boolean;
  anomalyNote: string | null;
};

type AnomalyMonthContext = {
  periodMonth: string;
  anomalyNote: string | null;
  outboundQty: number;
  writeoffQty: number;
};

type PreviousForecastContext = {
  forecastId: string;
  model: string;
  createdAt: string;
  inputHash: string;
  forecast: {
    oneMonthDemand: number;
    threeMonthDemand: number;
    sixMonthDemand: number;
    confidence: number;
    trend: AiTrend;
    seasonality: string;
  };
  reorder: AiForecastAnalysis["reorder"];
  risks: {
    stockout: AiRiskLevel;
    overstock: AiRiskLevel;
    expiry: AiRiskLevel;
  };
  executiveSummary: string;
};

type ReferenceMetricsContext = {
  averageMonthlyOutbound: number;
  lastThreeMonthsOutboundAverage: number;
  averageDailyOutbound: number;
  daysCoverage: number | null;
  writeoffTotal: number;
  inboundTotal: number;
  outboundTotal: number;
  expiryQuantityIn90Days: number;
  expiryQuantityIn180Days: number;
};

type HashInputContext = {
  asOfDate: string;
  skuPassport: SkuPassportContext;
  currentStock: number;
  costs: CostsContext;
  leadTimeDays: number;
  serviceLevel: number;
  lots: LotContext[];
  movementHistory: MovementContext[];
  anomalyMonths: AnomalyMonthContext[];
  referenceMetrics: ReferenceMetricsContext;
};

export type AiForecastContext = HashInputContext & {
  previousForecast: PreviousForecastContext | null;
  hashInput: HashInputContext;
};

function toDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function sumBy<T>(items: T[], selector: (item: T) => number): number {
  return roundTo(items.reduce((total, item) => total + selector(item), 0));
}

function averageBy<T>(items: T[], selector: (item: T) => number): number {
  if (items.length === 0) {
    return 0;
  }

  return roundTo(sumBy(items, selector) / items.length);
}

function mapSkuPassport(sku: SkuItem): SkuPassportContext {
  return {
    id: sku.id,
    name: sku.name,
    dosageForm: sku.dosageForm,
    category: sku.category,
    storageCondition: sku.storageCondition,
    shelfLifeDays: sku.shelfLifeDays,
    unit: sku.unit,
    supplier: sku.supplier,
  };
}

function mapLot(lot: InventoryLot, referenceDate: Date): LotContext {
  return {
    lotNumber: lot.lotNumber,
    quantity: lot.quantity,
    receivedAt: lot.receivedAt,
    expiresAt: lot.expiresAt,
    daysToExpiry: calculateDaysToExpiry(lot.expiresAt, referenceDate),
  };
}

function mapMovement(movement: InventoryMovement): MovementContext {
  return {
    periodMonth: movement.periodMonth,
    inboundQty: movement.inboundQty,
    outboundQty: movement.outboundQty,
    writeoffQty: movement.writeoffQty,
    endingStock: movement.endingStock,
    anomalyFlag: movement.anomalyFlag,
    anomalyNote: movement.anomalyNote,
  };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sortJsonValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortJsonValue);
  }

  if (isPlainObject(value)) {
    return Object.keys(value)
      .sort()
      .reduce<Record<string, unknown>>((sorted, key) => {
        sorted[key] = sortJsonValue(value[key]);
        return sorted;
      }, {});
  }

  return value;
}

function stableStringify(value: unknown): string {
  return JSON.stringify(sortJsonValue(value));
}

function mapPreviousForecast(
  forecast:
    | {
        id: string;
        model: string;
        input_hash: string;
        created_at: string;
        analysis: AiForecastAnalysis;
      }
    | undefined,
): PreviousForecastContext | null {
  if (!forecast) {
    return null;
  }

  return {
    forecastId: forecast.id,
    model: forecast.model,
    createdAt: forecast.created_at,
    inputHash: forecast.input_hash,
    forecast: {
      oneMonthDemand: forecast.analysis.forecast.oneMonthDemand,
      threeMonthDemand: forecast.analysis.forecast.threeMonthDemand,
      sixMonthDemand: forecast.analysis.forecast.sixMonthDemand,
      confidence: forecast.analysis.forecast.confidence,
      trend: forecast.analysis.forecast.trend,
      seasonality: forecast.analysis.forecast.seasonality,
    },
    reorder: forecast.analysis.reorder,
    risks: {
      stockout: forecast.analysis.risks.stockout.level,
      overstock: forecast.analysis.risks.overstock.level,
      expiry: forecast.analysis.risks.expiry.level,
    },
    executiveSummary: forecast.analysis.executiveSummary,
  };
}

export async function buildAiForecastContext(
  skuId: string,
): Promise<AiForecastContext> {
  const referenceDate = new Date();
  const asOfDate = toDateOnly(referenceDate);
  const bundle = await fetchSkuDetailData(skuId);

  if (!bundle.sku) {
    throw new SkuNotFoundError(skuId);
  }

  const sku = bundle.sku;
  const lots = [...(bundle.lotsBySkuId.get(sku.id) ?? [])]
    .sort((left, right) => left.expiresAt.localeCompare(right.expiresAt))
    .map((lot) => mapLot(lot, referenceDate));
  const movementHistory = [...(bundle.movementsBySkuId.get(sku.id) ?? [])]
    .sort((left, right) => left.periodMonth.localeCompare(right.periodMonth))
    .slice(-18)
    .map(mapMovement);
  const lastThreeMovements = movementHistory.slice(-3);
  const averageMonthlyOutbound = averageBy(
    movementHistory,
    (movement) => movement.outboundQty,
  );
  const referenceMetrics: ReferenceMetricsContext = {
    averageMonthlyOutbound,
    lastThreeMonthsOutboundAverage: averageBy(
      lastThreeMovements,
      (movement) => movement.outboundQty,
    ),
    averageDailyOutbound: roundTo(averageMonthlyOutbound / 30),
    daysCoverage: calculateDaysCoverage(sku.currentStock, averageMonthlyOutbound),
    writeoffTotal: sumBy(movementHistory, (movement) => movement.writeoffQty),
    inboundTotal: sumBy(movementHistory, (movement) => movement.inboundQty),
    outboundTotal: sumBy(movementHistory, (movement) => movement.outboundQty),
    expiryQuantityIn90Days: calculateQuantityAtRiskByExpiry(
      bundle.lotsBySkuId.get(sku.id) ?? [],
      90,
      referenceDate,
    ),
    expiryQuantityIn180Days: calculateQuantityAtRiskByExpiry(
      bundle.lotsBySkuId.get(sku.id) ?? [],
      180,
      referenceDate,
    ),
  };
  const skuPassport = mapSkuPassport(sku);
  const costs = {
    unitCost: sku.unitCost,
    orderCost: sku.orderCost,
    holdingCostRate: sku.holdingCostRate,
  };
  const anomalyMonths = movementHistory
    .filter((movement) => movement.anomalyFlag)
    .map((movement) => ({
      periodMonth: movement.periodMonth,
      anomalyNote: movement.anomalyNote,
      outboundQty: movement.outboundQty,
      writeoffQty: movement.writeoffQty,
    }));
  const hashInput: HashInputContext = {
    asOfDate,
    skuPassport,
    currentStock: sku.currentStock,
    costs,
    leadTimeDays: sku.leadTimeDays,
    serviceLevel: sku.serviceLevel,
    lots,
    movementHistory,
    anomalyMonths,
    referenceMetrics,
  };

  return {
    ...hashInput,
    previousForecast: mapPreviousForecast(bundle.latestForecastsBySkuId.get(sku.id)),
    hashInput,
  };
}

export function buildAiInputHash(context: AiForecastContext): string {
  return createHash("sha256")
    .update(stableStringify(context.hashInput))
    .digest("hex");
}
