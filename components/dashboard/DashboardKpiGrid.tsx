import { KpiCard, type KpiTone } from "@/components/ui/KpiCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { DashboardKpi } from "@/types/api";

export type DashboardKpiGridProps = {
  kpis: DashboardKpi[];
};

function formatValue(value: DashboardKpi["value"], unit?: string): string {
  if (typeof value === "number") {
    const formatted = new Intl.NumberFormat("ru-RU", {
      maximumFractionDigits: 1,
    }).format(value);
    return unit ? `${formatted} ${unit}` : formatted;
  }
  return unit ? `${value} ${unit}` : value;
}

export function DashboardKpiGrid({ kpis }: DashboardKpiGridProps) {
  if (kpis.length === 0) {
    return (
      <EmptyState
        title="KPI ещё не рассчитаны"
        description="Метрики появятся, как только в Supabase окажутся данные о SKU и движении."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {kpis.map((kpi) => (
        <KpiCard
          key={kpi.id}
          title={kpi.title}
          value={formatValue(kpi.value, kpi.unit)}
          description={kpi.description}
          trendLabel={kpi.trendLabel}
          tone={(kpi.tone ?? "neutral") as KpiTone}
        />
      ))}
    </div>
  );
}
