import { AbcChart } from "@/components/charts/dashboard/AbcChart";
import { ChartContainer } from "@/components/charts/ChartContainer";
import { EmptyState } from "@/components/ui/EmptyState";
import type { DashboardAbcItem } from "@/types/api";

export type DashboardAbcPanelProps = {
  items: DashboardAbcItem[];
};

const classDescriptions: Record<DashboardAbcItem["abcClass"], string> = {
  A: "ключевые SKU, ~80% оборота — приоритет в закупках",
  B: "средняя оборачиваемость — стандартный режим планирования",
  C: "низкая оборачиваемость — кандидаты на оптимизацию запаса",
};

export function DashboardAbcPanel({ items }: DashboardAbcPanelProps) {
  return (
    <ChartContainer
      title="ABC-анализ"
      description="Структура запасов по стоимости. A — критичные позиции, C — медленно оборачиваемые."
      footer={
        <ul className="space-y-1">
          {(["A", "B", "C"] as const).map((cls) => (
            <li key={cls}>
              <span className="font-medium text-zinc-700 dark:text-zinc-200">
                {cls}:
              </span>{" "}
              {classDescriptions[cls]}
            </li>
          ))}
        </ul>
      }
    >
      {items.length === 0 ? (
        <EmptyState
          title="ABC-анализ ещё не рассчитан"
          description="После загрузки данных движения и стоимости появится распределение по классам A/B/C."
        />
      ) : (
        <AbcChart items={items} />
      )}
    </ChartContainer>
  );
}
