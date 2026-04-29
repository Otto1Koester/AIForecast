import type { ReactNode } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { RiskBadge } from "@/components/ui/RiskBadge";
import type { AiRisksBlock } from "@/types/ai";

import { formatStockWithUnit } from "./formatters";

type SkuRiskPanelProps = {
  risks: AiRisksBlock | null;
  unit: string;
};

type RiskBlockProps = {
  title: string;
  level: AiRisksBlock["stockout"]["level"];
  metricLabel: string;
  metricValue: ReactNode;
  explanation: string;
};

function RiskBlock({
  title,
  level,
  metricLabel,
  metricValue,
  explanation,
}: RiskBlockProps): ReactNode {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </h3>
        <RiskBadge level={level} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {metricLabel}
        </p>
        <p className="mt-1 text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {metricValue}
        </p>
      </div>
      <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
        {explanation}
      </p>
    </div>
  );
}

export function SkuRiskPanel({ risks, unit }: SkuRiskPanelProps): ReactNode {
  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <header className="space-y-1">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Риски
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Дефицит, затоваривание и истечение срока годности по оценке AI.
        </p>
      </header>

      {!risks ? (
        <EmptyState
          title="Риски ещё не рассчитаны"
          description="Появятся после первого AI-прогноза. Запустите пересчёт, чтобы получить оценку."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <RiskBlock
            title="Дефицит"
            level={risks.stockout.level}
            metricLabel="Дней до stockout"
            metricValue={
              risks.stockout.daysToStockout === null
                ? "—"
                : `${risks.stockout.daysToStockout} дн.`
            }
            explanation={risks.stockout.explanation}
          />
          <RiskBlock
            title="Затоваривание"
            level={risks.overstock.level}
            metricLabel="Дни покрытия"
            metricValue={
              risks.overstock.daysCoverage === null
                ? "—"
                : `${risks.overstock.daysCoverage} дн.`
            }
            explanation={risks.overstock.explanation}
          />
          <RiskBlock
            title="Срок годности"
            level={risks.expiry.level}
            metricLabel="Объём под риском"
            metricValue={formatStockWithUnit(
              risks.expiry.quantityAtRisk,
              unit,
            )}
            explanation={risks.expiry.explanation}
          />
        </div>
      )}
    </section>
  );
}
