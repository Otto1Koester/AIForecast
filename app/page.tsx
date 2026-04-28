export default function HomePage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Дашборд
        </h1>
        <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          AIForecast — сервис AI-прогнозирования запасов лекарственных средств.
          Здесь будут KPI, AI-алерты, ABC-анализ, дни покрытия и forecast vs fact.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Всего SKU", hint: "будет загружено из Supabase" },
          { label: "Риск дефицита", hint: "AI-анализ на след. этапе" },
          { label: "Риск затоваривания", hint: "AI-анализ на след. этапе" },
          { label: "Потенциальные списания", hint: "по партиям и срокам" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
          >
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{kpi.label}</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              —
            </p>
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">{kpi.hint}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
        Этап 1: базовый каркас. Реальные данные дашборда подключим на следующих этапах.
      </div>
    </section>
  );
}
