"use client";

import { useMemo, type ReactNode } from "react";

import { ChartContainer } from "@/components/charts/ChartContainer";
import { EmptyState } from "@/components/ui/EmptyState";
import { ForecastHorizonSelector } from "@/components/ui/ForecastHorizonSelector";
import { KpiCard } from "@/components/ui/KpiCard";
import { SkuForecastVsFactChart } from "@/components/charts/sku/SkuForecastVsFactChart";
import {
  HORIZON_FORECAST_TITLES,
  buildChartPointsForHorizon,
  hasAnyForecastPoint,
  type ForecastHorizon,
} from "@/lib/utils/forecast-horizon";
import type {
  SkuForecastVsFactPoint,
  SkuLatestAiForecast,
} from "@/types/api";

import { TREND_LABELS } from "./labels";
import { formatConfidence, formatStockWithUnit } from "./formatters";

type SkuForecastPanelProps = {
  points: SkuForecastVsFactPoint[];
  latestAiForecast: SkuLatestAiForecast | null;
  unit: string;
  horizon: ForecastHorizon;
  onHorizonChange: (next: ForecastHorizon) => void;
};

const HORIZON_DESCRIPTIONS: Record<ForecastHorizon, string> = {
  1: "Оперативный горизонт — ближайший спрос.",
  3: "Тактический горизонт планирования.",
  6: "Долгосрочный взгляд на потребность.",
};

function getDemandForHorizon(
  forecast: SkuLatestAiForecast["analysis"]["forecast"],
  horizon: ForecastHorizon,
): number {
  switch (horizon) {
    case 1:
      return forecast.oneMonthDemand;
    case 3:
      return forecast.threeMonthDemand;
    case 6:
      return forecast.sixMonthDemand;
  }
}

export function SkuForecastPanel({
  points,
  latestAiForecast,
  unit,
  horizon,
  onHorizonChange,
}: SkuForecastPanelProps): ReactNode {
  const analysis = latestAiForecast?.analysis.forecast;

  const chartPoints = useMemo(
    () => buildChartPointsForHorizon(points, horizon),
    [points, horizon],
  );
  const hasFact = chartPoints.some((p) => p.fact !== null);
  const hasForecastPointForHorizon = hasAnyForecastPoint(points);
  const hasAnyForecast = points.some((p) => p.forecast !== null);

  return (
    <section className="space-y-4">
      <ChartContainer
        title="Прогноз и факт"
        description={
          hasAnyForecast
            ? `${HORIZON_FORECAST_TITLES[horizon]} — выбранный горизонт планирования.`
            : "Сравнение фактического расхода с AI-прогнозом по месяцам."
        }
      >
        {!hasFact && !hasForecastPointForHorizon ? (
          <EmptyState
            title="Нет данных для сравнения"
            description="Появится, как только появится история движения и AI-прогноз."
          />
        ) : (
          <SkuForecastVsFactChart
            points={chartPoints}
            unit={unit}
            hasForecast={hasForecastPointForHorizon}
          />
        )}
      </ChartContainer>

      {analysis ? (
        <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <header className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                AI-прогноз
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Выберите горизонт — значение прогноза и точка на графике
                обновятся без перезагрузки.
              </p>
            </div>
            <ForecastHorizonSelector
              value={horizon}
              onChange={onHorizonChange}
              ariaLabel="Горизонт прогноза"
            />
          </header>

          <div className="grid gap-4 sm:grid-cols-2">
            <KpiCard
              title={HORIZON_FORECAST_TITLES[horizon]}
              value={formatStockWithUnit(getDemandForHorizon(analysis, horizon), unit)}
              description={HORIZON_DESCRIPTIONS[horizon]}
            />
            <KpiCard
              title="Уверенность модели"
              value={formatConfidence(analysis.confidence)}
              description={`Тренд: ${TREND_LABELS[analysis.trend]}`}
              tone={
                analysis.confidence === null
                  ? "neutral"
                  : analysis.confidence >= 0.75 ||
                      (analysis.confidence > 1 && analysis.confidence >= 75)
                    ? "success"
                    : analysis.confidence >= 0.5 ||
                        (analysis.confidence > 1 && analysis.confidence >= 50)
                      ? "warning"
                      : "danger"
              }
            />
          </div>
        </section>
      ) : (
        <EmptyState
          title="AI-прогноз ещё не рассчитан"
          description="Нажмите «Пересчитать AI-прогноз», чтобы получить прогноз на 1, 3 и 6 месяцев."
        />
      )}
    </section>
  );
}
