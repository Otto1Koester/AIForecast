import type {
  DashboardAbcItem,
  DashboardAlert,
  DashboardKpi,
  DashboardResponse,
  DashboardTopRiskSku,
  RecommendationSummary,
} from "@/types/api";
import type { AiRecommendationPriority, AiRiskLevel } from "@/types/ai";
import type { AbcClass, SkuItem } from "@/types/inventory";
import {
  mapRecommendationSummary,
  toRiskLevel,
  roundTo,
} from "@/lib/sku/mappers";
import {
  buildDashboardForecastVsFactPoints,
  calculateSkuMetrics,
} from "@/lib/sku/metrics";
import type {
  AiForecastRow,
  SkuComputedMetrics,
  SkuDataBundle,
  SkuMetricsById,
} from "@/lib/sku/types";

const HIGH_RISKS: readonly AiRiskLevel[] = ["high", "critical"];

function getMetrics(
  metricsBySkuId: SkuMetricsById,
  skuId: string,
): SkuComputedMetrics {
  const metrics = metricsBySkuId.get(skuId);

  if (!metrics) {
    throw new Error(`Missing computed metrics for SKU ${skuId}`);
  }

  return metrics;
}

function riskToPriority(level: AiRiskLevel): AiRecommendationPriority {
  if (level === "critical") {
    return "urgent";
  }

  if (level === "high") {
    return "high";
  }

  if (level === "medium") {
    return "medium";
  }

  return "low";
}

function isHighRisk(level: AiRiskLevel): boolean {
  return HIGH_RISKS.includes(level);
}

function createKpis(
  skus: SkuItem[],
  forecasts: AiForecastRow[],
  metricsBySkuId: SkuMetricsById,
): DashboardKpi[] {
  const forecastsBySkuId = new Map(forecasts.map((forecast) => [forecast.sku_id, forecast]));
  const totalInventoryValue = skus.reduce(
    (total, sku) => total + getMetrics(metricsBySkuId, sku.id).inventoryValue,
    0,
  );
  const potentialWriteOffValue = skus.reduce((total, sku) => {
    const metrics = getMetrics(metricsBySkuId, sku.id);
    return total + metrics.quantityAtRisk180Days * sku.unitCost;
  }, 0);
  const stockoutRiskCount = forecasts.filter((forecast) =>
    isHighRisk(toRiskLevel(forecast.stockout_risk)),
  ).length;
  const overstockRiskCount = forecasts.filter((forecast) =>
    isHighRisk(toRiskLevel(forecast.overstock_risk)),
  ).length;
  const expiryRiskCount = skus.filter((sku) => {
    const forecast = forecastsBySkuId.get(sku.id);

    if (forecast) {
      return isHighRisk(toRiskLevel(forecast.expiry_risk));
    }

    return isHighRisk(getMetrics(metricsBySkuId, sku.id).referenceExpiryRisk);
  }).length;

  return [
    {
      id: "total-sku",
      title: "Всего SKU",
      value: skus.length,
      tone: "neutral",
    },
    {
      id: "stockout-risk",
      title: "Риск дефицита",
      value: stockoutRiskCount,
      description: "Высокий или критический риск по последним AI-прогнозам.",
      tone: stockoutRiskCount > 0 ? "danger" : "success",
    },
    {
      id: "overstock-risk",
      title: "Риск затоваривания",
      value: overstockRiskCount,
      description: "Высокий или критический риск по последним AI-прогнозам.",
      tone: overstockRiskCount > 0 ? "warning" : "success",
    },
    {
      id: "expiry-risk",
      title: "Риск срока годности",
      value: expiryRiskCount,
      description:
        "AI-риск при наличии прогноза, иначе справочная оценка по партиям с близким сроком годности.",
      tone: expiryRiskCount > 0 ? "warning" : "success",
    },
    {
      id: "inventory-value",
      title: "Стоимость запасов",
      value: roundTo(totalInventoryValue),
      unit: "USD",
      tone: "neutral",
    },
    {
      id: "potential-write-off",
      title: "Потенциальное списание",
      value: roundTo(potentialWriteOffValue),
      unit: "USD",
      description:
        "Справочная стоимость партий со сроком годности в ближайшие 180 дней.",
      tone: potentialWriteOffValue > 0 ? "warning" : "success",
    },
  ];
}

function createAlerts(
  skusById: Map<string, SkuItem>,
  forecasts: AiForecastRow[],
): DashboardAlert[] {
  return forecasts.flatMap((forecast) => {
    const sku = skusById.get(forecast.sku_id);

    if (!sku) {
      return [];
    }

    const recommendation = forecast.analysis.recommendations[0];
    const risks = [
      {
        id: "stockout",
        level: toRiskLevel(forecast.stockout_risk),
        title: "Риск дефицита",
        message: forecast.analysis.risks.stockout.explanation,
      },
      {
        id: "overstock",
        level: toRiskLevel(forecast.overstock_risk),
        title: "Риск затоваривания",
        message: forecast.analysis.risks.overstock.explanation,
      },
      {
        id: "expiry",
        level: toRiskLevel(forecast.expiry_risk),
        title: "Риск срока годности",
        message: forecast.analysis.risks.expiry.explanation,
      },
    ];

    return risks
      .filter((risk) => isHighRisk(risk.level))
      .map((risk) => ({
        id: `${forecast.id}-${risk.id}`,
        skuId: sku.id,
        skuName: sku.name,
        level: risk.level,
        title: risk.title,
        message: risk.message,
        recommendedAction: recommendation?.action,
        createdAt: forecast.created_at,
      }));
  });
}

function createAbcAnalysis(
  skus: SkuItem[],
  metricsBySkuId: SkuMetricsById,
): DashboardAbcItem[] {
  const totals = new Map<AbcClass, { skuCount: number; inventoryValue: number }>([
    ["A", { skuCount: 0, inventoryValue: 0 }],
    ["B", { skuCount: 0, inventoryValue: 0 }],
    ["C", { skuCount: 0, inventoryValue: 0 }],
  ]);
  const totalValue = skus.reduce(
    (total, sku) => total + getMetrics(metricsBySkuId, sku.id).inventoryValue,
    0,
  );

  for (const sku of skus) {
    const metrics = getMetrics(metricsBySkuId, sku.id);
    const item = totals.get(metrics.abcClass);

    if (item) {
      item.skuCount += 1;
      item.inventoryValue += metrics.inventoryValue;
    }
  }

  return (["A", "B", "C"] as const).map((abcClass) => {
    const item = totals.get(abcClass) ?? { skuCount: 0, inventoryValue: 0 };

    return {
      abcClass,
      skuCount: item.skuCount,
      inventoryValue: roundTo(item.inventoryValue),
      share: totalValue > 0 ? roundTo(item.inventoryValue / totalValue, 4) : 0,
    };
  });
}

function createCoverage(
  skus: SkuItem[],
  forecastsBySkuId: Map<string, AiForecastRow>,
  metricsBySkuId: SkuMetricsById,
) {
  const rows = skus.map((sku) => {
    const metrics = getMetrics(metricsBySkuId, sku.id);
    const forecast = forecastsBySkuId.get(sku.id);

    return {
      skuId: sku.id,
      skuName: sku.name,
      daysCoverage: metrics.daysCoverage,
      currentStock: sku.currentStock,
      unit: sku.unit,
      stockoutRisk: forecast
        ? toRiskLevel(forecast.stockout_risk)
        : metrics.referenceStockoutRisk,
    };
  });

  const withCoverage = rows.filter((row) => row.daysCoverage !== null);
  const bottom = [...withCoverage]
    .sort((a, b) => (a.daysCoverage ?? 0) - (b.daysCoverage ?? 0))
    .slice(0, 5);
  const top = [...withCoverage]
    .sort((a, b) => (b.daysCoverage ?? 0) - (a.daysCoverage ?? 0))
    .slice(0, 5);

  return [...bottom, ...top];
}

function createReferenceRecommendation(
  sku: SkuItem,
  metrics: SkuComputedMetrics,
): RecommendationSummary {
  const level =
    metrics.referenceExpiryRisk === "high" ||
    metrics.referenceExpiryRisk === "critical"
      ? metrics.referenceExpiryRisk
      : metrics.referenceStockoutRisk;

  return {
    action: "monitor",
    priority: riskToPriority(level),
    reasoning:
      "AI-прогноз ещё не рассчитан; это справочная позиция для контроля на основе дней покрытия или срока годности партии.",
  };
}

function createTopRiskSkus(
  skus: SkuItem[],
  forecastsBySkuId: Map<string, AiForecastRow>,
  metricsBySkuId: SkuMetricsById,
): DashboardTopRiskSku[] {
  const hasForecasts = forecastsBySkuId.size > 0;

  return skus
    .map((sku) => {
      const metrics = getMetrics(metricsBySkuId, sku.id);
      const forecast = forecastsBySkuId.get(sku.id);
      const stockoutRisk = forecast
        ? toRiskLevel(forecast.stockout_risk)
        : metrics.referenceStockoutRisk;
      const overstockRisk = forecast ? toRiskLevel(forecast.overstock_risk) : "low";
      const expiryRisk = forecast
        ? toRiskLevel(forecast.expiry_risk)
        : metrics.referenceExpiryRisk;
      const primaryRecommendation = forecast?.analysis.recommendations[0]
        ? mapRecommendationSummary(forecast.analysis.recommendations[0])
        : createReferenceRecommendation(sku, metrics);

      return {
        skuId: sku.id,
        skuName: sku.name,
        abcClass: metrics.abcClass,
        daysCoverage: metrics.daysCoverage,
        stockoutRisk,
        overstockRisk,
        expiryRisk,
        primaryRecommendation,
      };
    })
    .filter((item) => {
      if (!hasForecasts) {
        return (
          isHighRisk(item.stockoutRisk) ||
          isHighRisk(item.expiryRisk) ||
          item.daysCoverage !== null
        );
      }

      return (
        isHighRisk(item.stockoutRisk) ||
        isHighRisk(item.overstockRisk) ||
        isHighRisk(item.expiryRisk)
      );
    })
    .sort((a, b) => {
      const aCoverage = a.daysCoverage ?? Number.POSITIVE_INFINITY;
      const bCoverage = b.daysCoverage ?? Number.POSITIVE_INFINITY;
      return aCoverage - bCoverage;
    })
    .slice(0, 8);
}

export function createDashboardResponse(bundle: SkuDataBundle): DashboardResponse {
  const metricsBySkuId = calculateSkuMetrics(
    bundle.skus,
    bundle.lotsBySkuId,
    bundle.movementsBySkuId,
  );
  const forecasts = [...bundle.latestForecastsBySkuId.values()];
  const forecastsBySkuId = bundle.latestForecastsBySkuId;
  const skusById = new Map(bundle.skus.map((sku) => [sku.id, sku]));
  const movements = [...bundle.movementsBySkuId.values()].flat();
  const runs = [...bundle.latestRunsBySkuId.values()];
  const latestForecast = [...forecasts].sort((a, b) =>
    b.created_at.localeCompare(a.created_at),
  )[0];

  return {
    generatedAt: new Date().toISOString(),
    kpis: createKpis(bundle.skus, forecasts, metricsBySkuId),
    alerts: createAlerts(skusById, forecasts),
    abcAnalysis: createAbcAnalysis(bundle.skus, metricsBySkuId),
    coverage: createCoverage(bundle.skus, forecastsBySkuId, metricsBySkuId),
    forecastVsFact: buildDashboardForecastVsFactPoints(movements, forecasts),
    topRiskSkus: createTopRiskSkus(bundle.skus, forecastsBySkuId, metricsBySkuId),
    aiStatus: {
      hasForecasts: forecasts.length > 0,
      totalForecasts: forecasts.length,
      lastForecastAt: latestForecast?.created_at ?? null,
      lastForecastModel: latestForecast?.model ?? null,
      pendingRuns: runs.filter((run) => run.status === "pending").length,
      failedRuns: runs.filter((run) => run.status === "error").length,
    },
  };
}
