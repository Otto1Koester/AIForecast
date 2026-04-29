import type { ReactNode } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { LotExpiryChart } from "@/components/charts/sku/LotExpiryChart";
import type { SkuLotDto } from "@/types/api";

import { formatDate, formatStockWithUnit } from "./formatters";

type SkuLotsPanelProps = {
  lots: SkuLotDto[];
  unit: string;
};

function expiryTone(daysToExpiry: number | null, isExpired: boolean): {
  label: string;
  className: string;
} {
  if (isExpired || (daysToExpiry !== null && daysToExpiry < 0)) {
    return {
      label: "Истёк",
      className:
        "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900/60",
    };
  }
  if (daysToExpiry === null) {
    return {
      label: "Срок не определён",
      className:
        "bg-zinc-100 text-zinc-700 ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-700",
    };
  }
  if (daysToExpiry <= 30) {
    return {
      label: "Критично",
      className:
        "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900/60",
    };
  }
  if (daysToExpiry <= 90) {
    return {
      label: "Скоро",
      className:
        "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:ring-orange-900/60",
    };
  }
  if (daysToExpiry <= 180) {
    return {
      label: "Контроль",
      className:
        "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60",
    };
  }
  return {
    label: "Норма",
    className:
      "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/60",
  };
}

export function SkuLotsPanel({ lots, unit }: SkuLotsPanelProps): ReactNode {
  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <header className="space-y-1">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Партии и сроки годности
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Текущие лоты, остаток в каждой партии и контрольный срок до истечения.
        </p>
      </header>

      {lots.length === 0 ? (
        <EmptyState
          title="Партии не найдены"
          description="Лоты появятся, когда поступления будут зарегистрированы в Supabase."
        />
      ) : (
        <div className="space-y-5">
          <div className="overflow-x-auto rounded-md border border-zinc-200 dark:border-zinc-800">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900/40 dark:text-zinc-400">
                <tr>
                  <th className="px-3 py-2">Лот</th>
                  <th className="px-3 py-2 text-right">Количество</th>
                  <th className="px-3 py-2">Получено</th>
                  <th className="px-3 py-2">Срок годности</th>
                  <th className="px-3 py-2 text-right">Дней до истечения</th>
                  <th className="px-3 py-2">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700 dark:divide-zinc-800 dark:text-zinc-200">
                {lots.map((lot) => {
                  const tone = expiryTone(lot.daysToExpiry, lot.isExpired);
                  return (
                    <tr key={lot.id}>
                      <td className="px-3 py-2 font-mono text-xs">
                        {lot.lotNumber}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {formatStockWithUnit(lot.quantity, unit)}
                      </td>
                      <td className="px-3 py-2 text-zinc-500 dark:text-zinc-400">
                        {formatDate(lot.receivedAt)}
                      </td>
                      <td className="px-3 py-2">{formatDate(lot.expiresAt)}</td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {lot.daysToExpiry === null
                          ? "—"
                          : `${lot.daysToExpiry} дн.`}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${tone.className}`}
                        >
                          {tone.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="rounded-md border border-zinc-200 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-900/30">
            <LotExpiryChart lots={lots} unit={unit} />
          </div>
        </div>
      )}
    </section>
  );
}
