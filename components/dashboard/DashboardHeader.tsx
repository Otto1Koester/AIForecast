import Link from "next/link";

export type DashboardHeaderProps = {
  generatedAt?: string;
};

function formatGeneratedAt(value: string | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

export function DashboardHeader({ generatedAt }: DashboardHeaderProps) {
  const generated = formatGeneratedAt(generatedAt);

  return (
    <header className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-6 shadow-sm dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-900 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          AIForecast · MVP
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Главная
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          AI-прогнозирование запасов лекарственных средств. Данные о SKU, партиях
          и движении читаются из Supabase, AI-анализ через OpenRouter
          сохраняется и переиспользуется в виджетах ниже.
        </p>
        {generated ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            Обновлено: {generated}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/sku"
          className="inline-flex items-center rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          Каталог SKU →
        </Link>
        <Link
          href="/methodology"
          className="inline-flex items-center rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          Методология
        </Link>
      </div>
    </header>
  );
}
