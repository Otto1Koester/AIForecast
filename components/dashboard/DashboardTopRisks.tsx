import Link from "next/link";

import { AbcBadge } from "@/components/ui/AbcBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { RiskBadge } from "@/components/ui/RiskBadge";
import type { DashboardTopRiskSku } from "@/types/api";

export type DashboardTopRisksProps = {
  items: DashboardTopRiskSku[];
};

const recommendationLabels: Record<string, string> = {
  reorder: "Перезаказать",
  accelerate_sales: "Ускорить продажи",
  write_off: "Списать",
  monitor: "Мониторить",
  adjust_safety_stock: "Скорректировать страховой запас",
};

const priorityStyles: Record<string, string> = {
  low: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
};

export function DashboardTopRisks({ items }: DashboardTopRisksProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Топ SKU по риску
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Позиции, на которые AI рекомендует обратить внимание в первую очередь.
          </p>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="p-4">
          <EmptyState
            title="Рисковых SKU не найдено"
            description="Появится после AI-расчёта по позициям с короткими сроками или дефицитом."
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-2 font-medium">SKU</th>
                <th className="px-4 py-2 font-medium">ABC</th>
                <th className="px-4 py-2 font-medium">Покрытие</th>
                <th className="px-4 py-2 font-medium">Дефицит</th>
                <th className="px-4 py-2 font-medium">Затоваривание</th>
                <th className="px-4 py-2 font-medium">Срок годности</th>
                <th className="px-4 py-2 font-medium">Рекомендация</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {items.map((item) => (
                <tr
                  key={item.skuId}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  <td className="px-4 py-2">
                    <Link
                      href={`/sku/${item.skuId}`}
                      className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                    >
                      {item.skuName}
                    </Link>
                  </td>
                  <td className="px-4 py-2">
                    <AbcBadge value={item.abcClass} />
                  </td>
                  <td className="px-4 py-2 text-zinc-700 dark:text-zinc-300">
                    {item.daysCoverage != null ? `${item.daysCoverage} дн.` : "—"}
                  </td>
                  <td className="px-4 py-2">
                    <RiskBadge level={item.stockoutRisk} />
                  </td>
                  <td className="px-4 py-2">
                    <RiskBadge level={item.overstockRisk} />
                  </td>
                  <td className="px-4 py-2">
                    <RiskBadge level={item.expiryRisk} />
                  </td>
                  <td className="px-4 py-2">
                    {item.primaryRecommendation ? (
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            priorityStyles[item.primaryRecommendation.priority] ??
                            priorityStyles.low
                          }`}
                        >
                          {recommendationLabels[
                            item.primaryRecommendation.action
                          ] ?? item.primaryRecommendation.action}
                        </span>
                        <span className="line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                          {item.primaryRecommendation.reasoning}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
