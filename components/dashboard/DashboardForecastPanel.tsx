import { ForecastVsFactChart } from "@/components/charts/dashboard/ForecastVsFactChart";
import { ChartContainer } from "@/components/charts/ChartContainer";
import { EmptyState } from "@/components/ui/EmptyState";
import type { DashboardForecastVsFactPoint } from "@/types/api";

export type DashboardForecastPanelProps = {
  points: DashboardForecastVsFactPoint[];
};

export function DashboardForecastPanel({ points }: DashboardForecastPanelProps) {
  const hasForecast = points.some((p) => p.forecast != null);
  const hasFact = points.some((p) => p.fact != null);

  return (
    <ChartContainer
      title="Forecast vs Fact"
      description="Сравнение фактического потребления и AI-прогноза по периодам."
      footer={
        hasForecast
          ? "Сплошная линия — фактическое потребление, пунктир — AI-прогноз."
          : "Пунктирная линия появится после первого расчёта AI-прогноза."
      }
    >
      {points.length === 0 || (!hasForecast && !hasFact) ? (
        <EmptyState
          title="Forecast vs Fact ещё не готов"
          description="Запустите AI-прогноз в карточке любого SKU — здесь появится сводный график."
        />
      ) : (
        <ForecastVsFactChart points={points} />
      )}
    </ChartContainer>
  );
}
