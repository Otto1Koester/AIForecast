import type { ReactNode } from "react";

import { KpiCard } from "@/components/ui";

import { heroMetrics } from "./methodology-content";

export function MethodologyHero(): ReactNode {
  return (
    <section className="overflow-hidden rounded-xl border border-zinc-200 bg-gradient-to-br from-white via-zinc-50 to-emerald-50/70 p-6 shadow-sm dark:border-zinc-800 dark:from-zinc-950 dark:via-zinc-950 dark:to-emerald-950/20">
      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-end">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            AIForecast · методология
          </p>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              Методология AIForecast
            </h1>
            <p className="max-w-3xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
              Сервис помогает управлять запасами лекарственных средств через
              AI-прогнозирование: анализирует SKU, партии, сроки годности и
              движения, затем объясняет прогноз спроса, ROP/EOQ, риски и
              рекомендуемые действия.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {heroMetrics.map((metric) => (
            <KpiCard
              key={metric.title}
              title={metric.badge ?? "Метрика"}
              value={metric.title}
              description={metric.description}
              className="bg-white/90 dark:bg-zinc-950/90"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
