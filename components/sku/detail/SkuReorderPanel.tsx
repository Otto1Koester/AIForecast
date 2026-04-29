import type { ReactNode } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import type { SkuReorderInfo } from "@/types/api";

import { formatInteger, formatStockWithUnit } from "./formatters";

type SkuReorderPanelProps = {
  reorder: SkuReorderInfo;
  unit: string;
};

function MetricRow({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}): ReactNode {
  return (
    <div className="rounded-md border border-zinc-200 bg-zinc-50/50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/30">
      <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {value}
      </p>
      {hint ? (
        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function SkuReorderPanel({
  reorder,
  unit,
}: SkuReorderPanelProps): ReactNode {
  const hasAny =
    reorder.rop !== null ||
    reorder.eoq !== null ||
    reorder.safetyStock !== null ||
    reorder.leadTimeDemand !== null ||
    reorder.explanation !== null;

  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <header className="space-y-1">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          ROP / EOQ
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Точка перезаказа, оптимальный размер заказа и страховой запас по
          расчётам AI.
        </p>
      </header>

      {!hasAny ? (
        <EmptyState
          title="ROP/EOQ ещё не рассчитаны"
          description="Параметры пополнения появятся после первого AI-прогноза. Нажмите «Пересчитать AI-прогноз», чтобы запустить расчёт."
        />
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricRow
              label="ROP — точка перезаказа"
              value={formatStockWithUnit(reorder.rop, unit)}
              hint="Минимальный остаток для запуска заказа"
            />
            <MetricRow
              label="EOQ — оптимальный заказ"
              value={formatStockWithUnit(reorder.eoq, unit)}
              hint="Размер партии с минимальной общей стоимостью"
            />
            <MetricRow
              label="Страховой запас"
              value={formatStockWithUnit(reorder.safetyStock, unit)}
              hint="Резерв на колебания спроса и сроков"
            />
            <MetricRow
              label="Спрос за lead time"
              value={formatInteger(reorder.leadTimeDemand)}
              hint="Ожидаемый расход за период поставки"
            />
          </div>
          {reorder.explanation ? (
            <div className="rounded-md border border-zinc-200 bg-zinc-50/50 p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-200">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Объяснение модели
              </p>
              <p className="mt-1 leading-6">{reorder.explanation}</p>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
