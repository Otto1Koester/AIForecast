import type { SkuDetailResponse } from "@/types/api";
import {
  mapAiMetadata,
  mapLatestAiForecast,
  mapReorderInfo,
  mapRiskSummary,
  mapSkuDetailHeader,
  mapSkuLotDto,
  mapSkuMovementDto,
  mapRecommendationSummary,
} from "@/lib/sku/mappers";
import {
  buildSkuForecastVsFactPoints,
  calculateSkuMetrics,
  createSkuDetailMetrics,
} from "@/lib/sku/metrics";
import type { SkuDataBundle } from "@/lib/sku/types";
import type { SkuItem } from "@/types/inventory";

export function createSkuDetailResponse(
  bundle: SkuDataBundle,
  sku: SkuItem,
): SkuDetailResponse {
  const metricsBySkuId = calculateSkuMetrics(
    bundle.skus,
    bundle.lotsBySkuId,
    bundle.movementsBySkuId,
  );
  const metrics = metricsBySkuId.get(sku.id);

  if (!metrics) {
    throw new Error(`Missing computed metrics for SKU ${sku.id}`);
  }

  const lots = bundle.lotsBySkuId.get(sku.id) ?? [];
  const movements = [...(bundle.movementsBySkuId.get(sku.id) ?? [])]
    .sort((a, b) => b.periodMonth.localeCompare(a.periodMonth))
    .slice(0, 18)
    .sort((a, b) => a.periodMonth.localeCompare(b.periodMonth));
  const forecast = bundle.latestForecastsBySkuId.get(sku.id);
  const run = bundle.latestRunsBySkuId.get(sku.id);

  return {
    header: mapSkuDetailHeader(sku, metrics),
    metrics: createSkuDetailMetrics(sku, metrics),
    lots: lots.map(mapSkuLotDto),
    movements: movements.map(mapSkuMovementDto),
    forecastVsFact: buildSkuForecastVsFactPoints(movements, forecast),
    reorder: mapReorderInfo(forecast),
    risks: forecast ? mapRiskSummary(forecast) : null,
    recommendations: forecast
      ? forecast.analysis.recommendations.map(mapRecommendationSummary)
      : [],
    latestAiForecast: mapLatestAiForecast(forecast),
    aiMetadata: mapAiMetadata(forecast, run),
  };
}
