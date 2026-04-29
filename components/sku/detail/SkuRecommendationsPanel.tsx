import type { ReactNode } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { formatUnitRu } from "@/lib/utils/format";
import type { AiRecommendation } from "@/types/ai";

import { ACTION_LABELS, PRIORITY_LABELS, PRIORITY_TONE } from "./labels";
import { formatInteger } from "./formatters";

type SkuRecommendationsPanelProps = {
  recommendations: AiRecommendation[];
  unit: string;
};

const priorityStyles: Record<
  "neutral" | "warning" | "danger",
  string
> = {
  neutral:
    "bg-zinc-100 text-zinc-700 ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-700",
  warning:
    "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60",
  danger:
    "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900/60",
};

export function SkuRecommendationsPanel({
  recommendations,
  unit,
}: SkuRecommendationsPanelProps): ReactNode {
  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <header className="space-y-1">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Рекомендации AI
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Какие действия модель считает приоритетными по этому SKU.
        </p>
      </header>

      {recommendations.length === 0 ? (
        <EmptyState
          title="Рекомендаций пока нет"
          description="После расчёта AI-прогноза здесь появятся приоритетные действия: заказ, ускорение продаж, списание или мониторинг."
        />
      ) : (
        <ol className="space-y-3">
          {recommendations.map((rec, index) => {
            const tone = PRIORITY_TONE[rec.priority];
            return (
              <li
                key={`${rec.action}-${index}`}
                className="rounded-md border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
                      #{index + 1}
                    </span>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {ACTION_LABELS[rec.action]}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${priorityStyles[tone]}`}
                  >
                    Приоритет: {PRIORITY_LABELS[rec.priority]}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-200">
                  {rec.reasoning}
                </p>
                {(rec.suggestedQuantity !== undefined ||
                  rec.deadlineDays !== undefined) && (
                  <dl className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                    {rec.suggestedQuantity !== undefined ? (
                      <div>
                        <dt className="uppercase tracking-wide">Объём</dt>
                        <dd className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                          {formatInteger(rec.suggestedQuantity)} {formatUnitRu(unit)}
                        </dd>
                      </div>
                    ) : null}
                    {rec.deadlineDays !== undefined ? (
                      <div>
                        <dt className="uppercase tracking-wide">Срок</dt>
                        <dd className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                          {rec.deadlineDays} дн.
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
