export default function SkuCatalogPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Каталог SKU
        </h1>
        <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Здесь будет таблица препаратов с фильтрами по риску, ABC-классу,
          условиям хранения и категории.
        </p>
      </header>

      <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
        Данные SKU будут загружены из Supabase на следующих этапах.
      </div>
    </section>
  );
}
