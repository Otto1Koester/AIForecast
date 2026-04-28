export default async function SkuDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          SKU
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Карточка SKU: <span className="font-mono">{id}</span>
        </h1>
        <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Здесь будут паспорт препарата, партии и сроки годности, история движения,
          AI-прогноз на 1/3/6 месяцев, ROP/EOQ и рекомендации.
        </p>
      </header>

      <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
        Этап 1: каркас. AI-анализ подключим на этапе AI forecast engine.
      </div>
    </section>
  );
}
