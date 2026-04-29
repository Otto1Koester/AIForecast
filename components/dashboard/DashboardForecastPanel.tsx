"use client";

import { useMemo, type ReactNode } from "react";

import { ForecastVsFactChart } from "@/components/charts/dashboard/ForecastVsFactChart";
import { ChartContainer } from "@/components/charts/ChartContainer";
import { EmptyState } from "@/components/ui/EmptyState";
import { ForecastHorizonSelector } from "@/components/ui/ForecastHorizonSelector";
import {
  HORIZON_FORECAST_TITLES,
  buildChartPointsForHorizon,
  hasAnyForecastPoint,
  type ForecastHorizon,
} from "@/lib/utils/forecast-horizon";
import type { DashboardForecastVsFactPoint } from "@/types/api";

export type DashboardForecastPanelProps = {
  points: DashboardForecastVsFactPoint[];
  horizon: ForecastHorizon;
  onHorizonChange: (next: ForecastHorizon) => void;
};

export function DashboardForecastPanel({
  points,
  horizon,
  onHorizonChange,
}: DashboardForecastPanelProps): ReactNode {
  const hasAnyForecast = points.some((p) => p.forecast != null);
  const hasFact = points.some((p) => p.fact != null);

  const chartPoints = useMemo(
    () => buildChartPointsForHorizon(points, horizon),
    [points, horizon],
  );
  const hasForecastPoint = hasAnyForecastPoint(points);

  return (
    <ChartContainer
      title="Прогноз и факт"
      description={
        hasAnyForecast
          ? `${HORIZON_FORECAST_TITLES[horizon]} — выбранный горизонт планирования.`
          : "Сравнение фактического потребления и AI-прогноза по периодам."
      }
      footer={
        hasAnyForecast
          ? hasForecastPoint
            ? "Сплошная линия — фактическое потребление, пунктир — AI-прогноз на выбранный горизонт."
            : "Нет данных прогноза для выбранного горизонта."
          : "Пунктирная линия появится после первого расчёта AI-прогноза."
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
          Горизонт планирования
        </p>
        <ForecastHorizonSelector
          value={horizon}
          onChange={onHorizonChange}
          ariaLabel="Горизонт планирования"
        />
      </div>

      {points.length === 0 || (!hasAnyForecast && !hasFact) ? (
        <EmptyState
          title="График «прогноз и факт» ещё не готов"
          description="Запустите AI-прогноз в карточке любого SKU — здесь появится сводный график."
        />
      ) : (
        <ForecastVsFactChart points={chartPoints} />
      )}
    </ChartContainer>
  );
}
