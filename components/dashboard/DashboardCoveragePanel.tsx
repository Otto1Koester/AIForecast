import { CoverageChart } from "@/components/charts/dashboard/CoverageChart";
import { ChartContainer } from "@/components/charts/ChartContainer";
import { EmptyState } from "@/components/ui/EmptyState";
import type { DashboardCoverageItem } from "@/types/api";

export type DashboardCoveragePanelProps = {
  items: DashboardCoverageItem[];
};

export function DashboardCoveragePanel({ items }: DashboardCoveragePanelProps) {
  const hasCoverage = items.some((item) => item.daysCoverage != null);

  return (
    <ChartContainer
      title="Дни покрытия"
      description="Сколько дней хватит текущего остатка по топ-10 SKU. Цвет — уровень риска дефицита."
    >
      {!hasCoverage ? (
        <EmptyState
          title="Покрытие ещё не рассчитано"
          description="Метрика появится после расчёта потребления и AI-прогноза по SKU."
        />
      ) : (
        <CoverageChart items={items} />
      )}
    </ChartContainer>
  );
}
