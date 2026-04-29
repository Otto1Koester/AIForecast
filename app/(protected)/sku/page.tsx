import { SkuCatalogClient } from "@/components/sku/catalog/SkuCatalogClient";

export default function SkuCatalogPage() {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Каталог SKU
        </h1>
        <p className="max-w-3xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Остатки, сроки годности, риски и AI-рекомендации по товарным
          позициям.
        </p>
        <p className="max-w-3xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          Данные о SKU и текущих запасах загружаются из Supabase. AI-метрики
          (ROP, EOQ, риски, рекомендации) появляются после расчёта прогноза в
          AI-движке.
        </p>
      </header>

      <SkuCatalogClient />
    </section>
  );
}
