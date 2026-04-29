import type {
  DashboardForecastVsFactPoint,
  SkuDetailMetric,
  SkuForecastVsFactPoint,
} from "@/types/api";
import type { AiRiskLevel } from "@/types/ai";
import type {
  AbcClass,
  InventoryLot,
  InventoryMovement,
  SkuItem,
} from "@/types/inventory";
import type { AiForecastRow, SkuComputedMetrics } from "@/lib/sku/types";

const DAY_MS = 24 * 60 * 60 * 1000;

function roundTo(value: number, digits = 2): number {
  const multiplier = 10 ** digits;
  return Math.round((value + Number.EPSILON) * multiplier) / multiplier;
}

function toUtcDateOnly(value: string | Date): Date {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function addMonths(date: Date, months: number): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1),
  );
}

function toPeriod(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${date.getUTCFullYear()}-${month}`;
}

function maxPeriodDate(movements: InventoryMovement[]): Date | null {
  if (movements.length === 0) {
    return null;
  }

  return movements.reduce<Date | null>((latest, movement) => {
    const periodDate = new Date(movement.periodMonth);
    return latest === null || periodDate > latest ? periodDate : latest;
  }, null);
}

export function calculateInventoryValue(sku: SkuItem): number {
  return roundTo(sku.currentStock * sku.unitCost);
}

export function calculateAverageMonthlyOutbound(
  movements: InventoryMovement[],
): number {
  if (movements.length === 0) {
    return 0;
  }

  const totalOutbound = movements.reduce(
    (total, movement) => total + movement.outboundQty,
    0,
  );

  return roundTo(totalOutbound / movements.length);
}

export function calculateDaysCoverage(
  currentStock: number,
  averageMonthlyOutbound: number,
): number | null {
  const averageDailyOutbound = averageMonthlyOutbound / 30;

  if (averageDailyOutbound <= 0) {
    return null;
  }

  return roundTo(currentStock / averageDailyOutbound, 1);
}

export function calculateDaysToExpiry(
  expiresAt: string,
  referenceDate = new Date(),
): number | null {
  if (!expiresAt) {
    return null;
  }

  const expiryDate = toUtcDateOnly(expiresAt);
  const currentDate = toUtcDateOnly(referenceDate);

  return Math.floor((expiryDate.getTime() - currentDate.getTime()) / DAY_MS);
}

export function calculateQuantityAtRiskByExpiry(
  lots: InventoryLot[],
  withinDays: number,
  referenceDate = new Date(),
): number {
  return roundTo(
    lots.reduce((total, lot) => {
      const daysToExpiry = calculateDaysToExpiry(lot.expiresAt, referenceDate);

      if (daysToExpiry === null || daysToExpiry < 0 || daysToExpiry > withinDays) {
        return total;
      }

      return total + lot.quantity;
    }, 0),
  );
}

export function calculateNearestExpiryDays(
  lots: InventoryLot[],
  referenceDate = new Date(),
): number | null {
  const activeExpiryDays = lots
    .map((lot) => calculateDaysToExpiry(lot.expiresAt, referenceDate))
    .filter((days): days is number => days !== null && days >= 0);

  if (activeExpiryDays.length === 0) {
    return null;
  }

  return Math.min(...activeExpiryDays);
}

function getReferenceStockoutRisk(daysCoverage: number | null): AiRiskLevel {
  if (daysCoverage === null) {
    return "low";
  }

  if (daysCoverage <= 7) {
    return "critical";
  }

  if (daysCoverage <= 21) {
    return "high";
  }

  if (daysCoverage <= 45) {
    return "medium";
  }

  return "low";
}

function getReferenceExpiryRisk(
  nearestExpiryDays: number | null,
  quantityAtRisk90Days: number,
): AiRiskLevel {
  if (nearestExpiryDays === null || quantityAtRisk90Days <= 0) {
    return "low";
  }

  if (nearestExpiryDays <= 30) {
    return "critical";
  }

  if (nearestExpiryDays <= 90) {
    return "high";
  }

  if (nearestExpiryDays <= 180) {
    return "medium";
  }

  return "low";
}

export function calculateSkuMetrics(
  skus: SkuItem[],
  lotsBySkuId: Map<string, InventoryLot[]>,
  movementsBySkuId: Map<string, InventoryMovement[]>,
  referenceDate = new Date(),
): Map<string, SkuComputedMetrics> {
  const inventoryValues = skus.map((sku) => ({
    skuId: sku.id,
    value: calculateInventoryValue(sku),
  }));
  const totalInventoryValue = inventoryValues.reduce(
    (total, item) => total + item.value,
    0,
  );
  const sortedValues = [...inventoryValues].sort((a, b) => b.value - a.value);

  let cumulativeValue = 0;
  const abcClassBySkuId = new Map<string, AbcClass>();

  for (const item of sortedValues) {
    cumulativeValue += item.value;
    const cumulativeShare =
      totalInventoryValue > 0 ? cumulativeValue / totalInventoryValue : 0;

    if (cumulativeShare <= 0.8) {
      abcClassBySkuId.set(item.skuId, "A");
    } else if (cumulativeShare <= 0.95) {
      abcClassBySkuId.set(item.skuId, "B");
    } else {
      abcClassBySkuId.set(item.skuId, "C");
    }
  }

  return new Map(
    skus.map((sku) => {
      const lots = lotsBySkuId.get(sku.id) ?? [];
      const movements = movementsBySkuId.get(sku.id) ?? [];
      const inventoryValue = calculateInventoryValue(sku);
      const averageMonthlyOutbound = calculateAverageMonthlyOutbound(movements);
      const averageDailyOutbound = roundTo(averageMonthlyOutbound / 30, 2);
      const daysCoverage = calculateDaysCoverage(
        sku.currentStock,
        averageMonthlyOutbound,
      );
      const quantityAtRisk90Days = calculateQuantityAtRiskByExpiry(
        lots,
        90,
        referenceDate,
      );
      const quantityAtRisk180Days = calculateQuantityAtRiskByExpiry(
        lots,
        180,
        referenceDate,
      );
      const nearestExpiryDays = calculateNearestExpiryDays(lots, referenceDate);

      return [
        sku.id,
        {
          inventoryValue,
          averageMonthlyOutbound,
          averageDailyOutbound,
          daysCoverage,
          abcClass: abcClassBySkuId.get(sku.id) ?? "C",
          quantityAtRisk90Days,
          quantityAtRisk180Days,
          nearestExpiryDays,
          referenceStockoutRisk: getReferenceStockoutRisk(daysCoverage),
          referenceExpiryRisk: getReferenceExpiryRisk(
            nearestExpiryDays,
            quantityAtRisk90Days,
          ),
        },
      ];
    }),
  );
}

export function createSkuDetailMetrics(
  sku: SkuItem,
  metrics: SkuComputedMetrics,
): SkuDetailMetric[] {
  return [
    {
      id: "current-stock",
      label: "Current stock",
      value: sku.currentStock,
      unit: sku.unit,
      tone: metrics.referenceStockoutRisk === "high" ? "warning" : "neutral",
    },
    {
      id: "inventory-value",
      label: "Inventory value",
      value: metrics.inventoryValue,
      unit: "USD",
      tone: "neutral",
    },
    {
      id: "days-coverage",
      label: "Days coverage",
      value: metrics.daysCoverage ?? "n/a",
      unit: metrics.daysCoverage === null ? undefined : "days",
      description: "Reference metric based on historical outbound movements.",
      tone:
        metrics.referenceStockoutRisk === "critical"
          ? "danger"
          : metrics.referenceStockoutRisk === "high"
            ? "warning"
            : "neutral",
    },
    {
      id: "expiry-risk",
      label: "Expiry risk",
      value: metrics.quantityAtRisk90Days,
      unit: sku.unit,
      description: "Quantity in lots expiring within 90 days.",
      tone:
        metrics.referenceExpiryRisk === "critical"
          ? "danger"
          : metrics.referenceExpiryRisk === "high"
            ? "warning"
            : "neutral",
    },
  ];
}

export function buildSkuForecastVsFactPoints(
  movements: InventoryMovement[],
  forecast: AiForecastRow | undefined,
): SkuForecastVsFactPoint[] {
  const factPoints = [...movements]
    .sort((a, b) => a.periodMonth.localeCompare(b.periodMonth))
    .map((movement) => ({
      period: toPeriod(movement.periodMonth),
      forecast: null,
      fact: movement.outboundQty,
    }));

  const latestFactPeriod = maxPeriodDate(movements);

  if (!forecast || latestFactPeriod === null) {
    return factPoints;
  }

  return [
    ...factPoints,
    {
      period: toPeriod(addMonths(latestFactPeriod, 1)),
      forecast: Number(forecast.forecast_1m),
      fact: null,
    },
    {
      period: toPeriod(addMonths(latestFactPeriod, 3)),
      forecast: Number(forecast.forecast_3m),
      fact: null,
    },
    {
      period: toPeriod(addMonths(latestFactPeriod, 6)),
      forecast: Number(forecast.forecast_6m),
      fact: null,
    },
  ];
}

export function buildDashboardForecastVsFactPoints(
  movements: InventoryMovement[],
  forecasts: AiForecastRow[],
): DashboardForecastVsFactPoint[] {
  const factByPeriod = new Map<string, number>();

  for (const movement of movements) {
    const period = toPeriod(movement.periodMonth);
    factByPeriod.set(period, (factByPeriod.get(period) ?? 0) + movement.outboundQty);
  }

  const factPoints = [...factByPeriod.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([period, fact]) => ({
      period,
      forecast: null,
      fact: roundTo(fact),
    }));

  const latestFactPeriod = maxPeriodDate(movements);

  if (forecasts.length === 0 || latestFactPeriod === null) {
    return factPoints;
  }

  const forecast1m = forecasts.reduce(
    (total, forecast) => total + Number(forecast.forecast_1m),
    0,
  );
  const forecast3m = forecasts.reduce(
    (total, forecast) => total + Number(forecast.forecast_3m),
    0,
  );
  const forecast6m = forecasts.reduce(
    (total, forecast) => total + Number(forecast.forecast_6m),
    0,
  );

  return [
    ...factPoints,
    {
      period: toPeriod(addMonths(latestFactPeriod, 1)),
      forecast: roundTo(forecast1m),
      fact: null,
    },
    {
      period: toPeriod(addMonths(latestFactPeriod, 3)),
      forecast: roundTo(forecast3m),
      fact: null,
    },
    {
      period: toPeriod(addMonths(latestFactPeriod, 6)),
      forecast: roundTo(forecast6m),
      fact: null,
    },
  ];
}
