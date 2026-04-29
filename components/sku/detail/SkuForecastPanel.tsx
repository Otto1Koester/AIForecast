import type { ReactNode } from "react";

import { ChartContainer } from "@/components/charts/ChartContainer";
import { EmptyState } from "@/components/ui/EmptyState";
import { KpiCard } from "@/components/ui/KpiCard";
import { SkuForecastVsFactChart } from "@/components/charts/sku/SkuForecastVsFactChart";
import type {
  SkuForecastVsFactPoint,
  SkuLatestAiForecast,
} from "@/types/api";

import { TREND_LABELS } from "./labels";
import {
  formatConfidence,
  formatStockWithUnit,
} from "./formatters";

type SkuForecastPanelProps = {
  points: SkuForecastVsFactPoint[];
  latestAiForecast: SkuLatestAiForecast | null;
  unit: string;
};

export function SkuForecastPanel({
  points,
  latestAiForecast,
  unit,
}: SkuForecastPanelProps): ReactNode {
  const hasFact = points.some((p) => p.fact !== null);
  const hasForecast = points.some((p) => p.forecast !== null);
  const analysis = latestAiForecast?.analysis.forecast;

  return (
    <section className="space-y-4">
      <ChartContainer
        title="Прогноз и факт"
        description="Сравнение фактического расхода с AI-прогнозом по месяцам."
      >
        {!hasFact && !hasForecast ? (
          <EmptyState
            title="Нет данных для сравнения"
            description="Появится, как только появится история движения и AI-прогноз."
          />
        ) : (
          <SkuForecastVsFactChart
            points={points}
            unit={unit}
            hasForecast={hasForecast}
          />
        )}
      </ChartContainer>

      {analysis ? (
        <div className="space-y-3">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              title="Прогноз 1 месяц"
              value={formatStockWithUnit(analysis.oneMonthDemand, unit)}
              description="AI-прогноз ближайшего спроса"
            />
            <KpiCard
              title="Прогноз 3 месяца"
              value={formatStockWithUnit(analysis.threeMonthDemand, unit)}
              description="Среднесрочный горизонт планирования"
            />
            <KpiCard
              title="Прогноз 6 месяцев"
              value={formatStockWithUnit(analysis.sixMonthDemand, unit)}
              description="Долгосрочный взгляд на потребность"
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
        </div>
      ) : (
        <EmptyState
          title="AI-прогноз ещё не рассчитан"
          description="Нажмите «Пересчитать AI-прогноз», чтобы вызвать OpenRouter и сохранить прогноз в Supabase."
        />
      )}
    </section>
  );
}
