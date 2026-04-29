import type { ReactNode } from "react";

import { KpiCard, type KpiTone } from "@/components/ui/KpiCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatRubFromUsd, formatUnitRu } from "@/lib/utils/format";
import type { SkuDetailMetric } from "@/types/api";

type SkuDetailMetricsProps = {
  metrics: SkuDetailMetric[];
};

function formatValue(
  value: SkuDetailMetric["value"],
  unit: string | undefined,
): string {
  if (unit === "USD") {
    return typeof value === "number" ? formatRubFromUsd(value) : String(value);
  }

  const displayUnit = unit ? formatUnitRu(unit) : "";
  if (typeof value === "number") {
    const formatted = new Intl.NumberFormat("ru-RU", {
      maximumFractionDigits: 1,
    }).format(value);
    return displayUnit ? `${formatted} ${displayUnit}` : formatted;
  }
  return displayUnit ? `${value} ${displayUnit}` : value;
}

export function SkuDetailMetrics({
  metrics,
}: SkuDetailMetricsProps): ReactNode {
  if (metrics.length === 0) {
    return (
      <EmptyState
        title="Метрики ещё не рассчитаны"
        description="Ключевые показатели появятся, как только в Supabase будут движения и остатки."
      />
    );
  }

  return (
    <section
      aria-label="Ключевые метрики SKU"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {metrics.map((metric) => (
        <KpiCard
          key={metric.id}
          title={metric.label}
          value={formatValue(metric.value, metric.unit)}
          description={metric.description}
          tone={(metric.tone ?? "neutral") as KpiTone}
        />
      ))}
    </section>
  );
}
