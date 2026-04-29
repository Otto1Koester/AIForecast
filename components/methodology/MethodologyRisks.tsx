import type { ReactNode } from "react";

import { RiskBadge } from "@/components/ui";

import { recommendationCards, riskCards } from "./methodology-content";
import {
  MethodologyCard,
  MethodologySection,
} from "./MethodologySection";

export function MethodologyRisks(): ReactNode {
  return (
    <MethodologySection
      eyebrow="Риски и действия"
      title="Как читать риски и рекомендации"
      description="Риск в AIForecast всегда связан с действием. Система не просто подсвечивает проблему, а объясняет, что делать закупщику или складу."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {riskCards.map((risk) => (
          <article
            key={risk.title}
            className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                {risk.title}
              </h3>
              <RiskBadge level={risk.level} />
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {risk.description}
            </p>
            <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm leading-6 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300">
              {risk.example}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {recommendationCards.map((recommendation) => (
          <MethodologyCard
            key={recommendation.title}
            title={recommendation.title}
            description={recommendation.description}
            badge={recommendation.badge}
          />
        ))}
      </div>
    </MethodologySection>
  );
}
