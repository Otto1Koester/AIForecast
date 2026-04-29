import type { DashboardAiStatus as DashboardAiStatusDto } from "@/types/api";

export type DashboardAiStatusProps = {
  status: DashboardAiStatusDto;
};

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function DashboardAiStatus({ status }: DashboardAiStatusProps) {
  const generated = status.hasForecasts;

  return (
    <section className="flex h-full flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Статус AI
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Состояние OpenRouter-прогноза по SKU.
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            generated
              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/60"
              : "bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${generated ? "bg-emerald-500" : "bg-zinc-400"}`}
            aria-hidden="true"
          />
          {generated ? "Активен" : "Не рассчитан"}
        </span>
      </header>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Модель
          </dt>
          <dd className="mt-0.5 truncate font-medium text-zinc-900 dark:text-zinc-50">
            {status.lastForecastModel ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            SKU с прогнозом
          </dt>
          <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-50">
            {status.totalForecasts}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Последний расчёт
          </dt>
          <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-50">
            {formatDate(status.lastForecastAt)}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            В очереди
          </dt>
          <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-50">
            {status.pendingRuns}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Ошибки
          </dt>
          <dd
            className={`mt-0.5 font-medium ${
              status.failedRuns > 0
                ? "text-red-600 dark:text-red-400"
                : "text-zinc-900 dark:text-zinc-50"
            }`}
          >
            {status.failedRuns}
          </dd>
        </div>
      </dl>

      {!generated ? (
        <p className="rounded-md bg-zinc-50 p-3 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
          AI-прогнозы ещё не рассчитаны. Запустите расчёт в карточке SKU, чтобы
          здесь появились алерты, риски и рекомендации.
        </p>
      ) : null}
    </section>
  );
}
