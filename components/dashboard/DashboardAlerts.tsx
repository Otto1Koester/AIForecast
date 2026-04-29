import Link from "next/link";

import { EmptyState } from "@/components/ui/EmptyState";
import { RiskBadge } from "@/components/ui/RiskBadge";
import type { DashboardAlert } from "@/types/api";

export type DashboardAlertsProps = {
  alerts: DashboardAlert[];
};

function formatAlertDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function DashboardAlerts({ alerts }: DashboardAlertsProps) {
  return (
    <section className="flex h-full flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            AI-алерты
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Сигналы от последнего AI-расчёта: дефицит, затоваривание, истечение
            срока годности и отклонения от прогноза.
          </p>
        </div>
        {alerts.length > 0 ? (
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            {alerts.length}
          </span>
        ) : null}
      </header>

      {alerts.length === 0 ? (
        <EmptyState
          title="AI-алертов пока нет"
          description="AI-алерты появятся после расчёта прогноза в карточке SKU."
        />
      ) : (
        <ul className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
          {alerts.map((alert) => (
            <li key={alert.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <RiskBadge level={alert.level} />
                    <Link
                      href={`/sku/${alert.skuId}`}
                      className="truncate text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                    >
                      {alert.skuName}
                    </Link>
                  </div>
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {alert.title}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {alert.message}
                  </p>
                </div>
                <time className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500">
                  {formatAlertDate(alert.createdAt)}
                </time>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
