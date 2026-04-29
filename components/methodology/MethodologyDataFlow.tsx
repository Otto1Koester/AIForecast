import type { ReactNode } from "react";

import { dataFlowSteps } from "./methodology-content";
import { MethodologySection } from "./MethodologySection";

export function MethodologyDataFlow(): ReactNode {
  return (
    <MethodologySection
      eyebrow="Поток данных"
      title="Как данные проходят через продукт"
      description="AIForecast не строит отдельную витрину из поддельных данных в браузере. Интерфейс опирается на демо-данные в Supabase, контракты API и сохранённый AI-результат."
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {dataFlowSteps.map((step, index) => (
          <article
            key={step.title}
            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/60">
                {index + 1}
              </span>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {step.title}
              </h3>
            </div>
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {step.description}
            </p>
          </article>
        ))}
      </div>
    </MethodologySection>
  );
}
