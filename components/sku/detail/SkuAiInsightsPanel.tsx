import type { ReactNode } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import type { AiForecastBlock } from "@/types/ai";

import { ANOMALY_LABELS, TREND_LABELS } from "./labels";
import { formatPeriodLabel } from "./formatters";

type SkuAiInsightsPanelProps = {
  forecast: AiForecastBlock | null;
  executiveSummary: string | null;
};

const trendStyles: Record<
  AiForecastBlock["trend"],
  { className: string; arrow: string }
> = {
  declining: {
    className:
      "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60",
    arrow: "↘",
  },
  stable: {
    className:
      "bg-zinc-100 text-zinc-700 ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-700",
    arrow: "→",
  },
  growing: {
    className:
      "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/60",
    arrow: "↗",
  },
};

export function SkuAiInsightsPanel({
  forecast,
  executiveSummary,
}: SkuAiInsightsPanelProps): ReactNode {
  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <header className="space-y-1">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Тренд, сезонность и аномалии
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Качественный анализ модели на основе истории движения за 18 месяцев.
        </p>
      </header>

      {!forecast ? (
        <EmptyState
          title="Анализ ещё не выполнен"
          description="Тренд, сезонность и аномалии появятся после первого AI-прогноза."
        />
      ) : (
        <div className="space-y-4">
          {executiveSummary ? (
            <div className="rounded-md border border-zinc-200 bg-zinc-50/50 p-3 text-sm leading-6 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-200">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Краткое резюме
              </p>
              <p className="mt-1">{executiveSummary}</p>
            </div>
          ) : null}

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-md border border-zinc-200 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-900/30">
              <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Тренд
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${trendStyles[forecast.trend].className}`}
                >
                  <span className="mr-1">{trendStyles[forecast.trend].arrow}</span>
                  {TREND_LABELS[forecast.trend]}
                </span>
              </div>
            </div>

            <div className="rounded-md border border-zinc-200 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-900/30">
              <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Сезонность
              </p>
              <p className="mt-1 text-sm leading-6 text-zinc-800 dark:text-zinc-100">
                {forecast.seasonality || "Не выявлена"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Аномалии
            </h3>
            {forecast.anomalies.length === 0 ? (
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Аномалий не обнаружено.
              </p>
            ) : (
              <ul className="mt-2 space-y-2">
                {forecast.anomalies.map((anomaly, idx) => (
                  <li
                    key={`${anomaly.period}-${idx}`}
                    className="rounded-md border border-amber-200 bg-amber-50/50 p-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/60 dark:text-amber-200">
                        {ANOMALY_LABELS[anomaly.type] ?? anomaly.type}
                      </span>
                      <span className="text-xs text-amber-700/80 dark:text-amber-300/80">
                        {formatPeriodLabel(anomaly.period)}
                      </span>
                    </div>
                    <p className="mt-1 leading-6">{anomaly.explanation}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
