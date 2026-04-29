import type { ReactNode } from "react";

import { KpiCard } from "@/components/ui/KpiCard";
import type { SkuListItem, SkuListMeta } from "@/types/api";

import { formatCurrency, formatInteger } from "./labels";

type SkuCatalogSummaryProps = {
  items: SkuListItem[];
  meta: SkuListMeta;
};

export function SkuCatalogSummary({
  items,
  meta,
}: SkuCatalogSummaryProps): ReactNode {
  const totalInventoryValue = items.reduce(
    (sum, item) => sum + (item.inventoryValue ?? 0),
    0,
  );

  const criticalCount = items.filter(
    (item) =>
      item.stockoutRisk === "critical" ||
      item.overstockRisk === "critical" ||
      item.expiryRisk === "critical",
  ).length;

  const withoutForecast = items.filter(
    (item) => !item.latestForecastCreatedAt,
  ).length;

  return (
    <section
      aria-label="Сводка каталога"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <KpiCard
        title="Всего SKU"
        value={formatInteger(meta.total)}
        description="В каталоге Supabase"
      />
      <KpiCard
        title="Стоимость запасов"
        value={formatCurrency(totalInventoryValue)}
        description="Сумма по текущим остаткам"
      />
      <KpiCard
        title="Критические риски"
        value={formatInteger(criticalCount)}
        description="SKU с критическим риском"
        tone={criticalCount > 0 ? "danger" : "success"}
      />
      <KpiCard
        title="Без AI-прогноза"
        value={formatInteger(withoutForecast)}
        description="Ожидают расчёта"
        tone={withoutForecast > 0 ? "warning" : "success"}
      />
    </section>
  );
}
