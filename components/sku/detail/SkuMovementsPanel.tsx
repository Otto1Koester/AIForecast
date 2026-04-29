import type { ReactNode } from "react";

import { ChartContainer } from "@/components/charts/ChartContainer";
import { EmptyState } from "@/components/ui/EmptyState";
import { MovementHistoryChart } from "@/components/charts/sku/MovementHistoryChart";
import type { SkuMovementDto } from "@/types/api";

import { formatPeriodLabel, formatStockWithUnit } from "./formatters";

type SkuMovementsPanelProps = {
  movements: SkuMovementDto[];
  unit: string;
};

export function SkuMovementsPanel({
  movements,
  unit,
}: SkuMovementsPanelProps): ReactNode {
  if (movements.length === 0) {
    return (
      <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <header className="space-y-1">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            История движения
          </h2>
        </header>
        <EmptyState
          title="История движения пуста"
          description="Когда в Supabase появятся приходы, расходы и списания, они отобразятся здесь."
        />
      </section>
    );
  }

  const sorted = [...movements].sort((a, b) =>
    a.periodMonth.localeCompare(b.periodMonth),
  );
  const recent = sorted.slice(-12).reverse();

  return (
    <section className="space-y-4">
      <ChartContainer
        title="История движения"
        description="Приход, расход, списания и остаток на конец периода за последние месяцы."
      >
        <MovementHistoryChart movements={sorted} unit={unit} />
      </ChartContainer>

      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <header className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Детализация по месяцам
          </h3>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Последние {recent.length} мес.
          </span>
        </header>
        <div className="overflow-x-auto rounded-md border border-zinc-200 dark:border-zinc-800">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900/40 dark:text-zinc-400">
              <tr>
                <th className="px-3 py-2">Месяц</th>
                <th className="px-3 py-2 text-right">Приход</th>
                <th className="px-3 py-2 text-right">Расход</th>
                <th className="px-3 py-2 text-right">Списания</th>
                <th className="px-3 py-2 text-right">Остаток на конец</th>
                <th className="px-3 py-2">Аномалия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700 dark:divide-zinc-800 dark:text-zinc-200">
              {recent.map((m) => (
                <tr
                  key={m.id}
                  className={
                    m.anomalyFlag
                      ? "bg-amber-50/40 dark:bg-amber-950/20"
                      : undefined
                  }
                >
                  <td className="px-3 py-2 font-medium">
                    {formatPeriodLabel(m.periodMonth)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {formatStockWithUnit(m.inboundQty, unit)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {formatStockWithUnit(m.outboundQty, unit)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {formatStockWithUnit(m.writeoffQty, unit)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {formatStockWithUnit(m.endingStock, unit)}
                  </td>
                  <td className="px-3 py-2 text-xs text-zinc-500 dark:text-zinc-400">
                    {m.anomalyFlag ? (
                      <span title={m.anomalyNote ?? undefined}>
                        ⚠ {m.anomalyNote ?? "Отмечена аномалия"}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
