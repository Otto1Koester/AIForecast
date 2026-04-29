import Link from "next/link";
import type { ReactNode } from "react";

import type { SkuDetailHeader as SkuDetailHeaderDto } from "@/types/api";
import type { AbcClass } from "@/types/inventory";

import { STORAGE_LABELS } from "./labels";
import { formatCurrency, formatPercent } from "./formatters";

type SkuDetailHeaderProps = {
  header: SkuDetailHeaderDto;
};

const abcStyles: Record<AbcClass, string> = {
  A: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/60",
  B: "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900/60",
  C: "bg-zinc-100 text-zinc-700 ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-700",
};

function PassportRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}): ReactNode {
  return (
    <div className="flex flex-col">
      <dt className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
        {value}
      </dd>
    </div>
  );
}

export function SkuDetailHeader({ header }: SkuDetailHeaderProps): ReactNode {
  return (
    <section className="space-y-5 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <nav
        aria-label="Хлебные крошки"
        className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400"
      >
        <Link
          href="/sku"
          className="rounded-md px-1.5 py-0.5 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
        >
          ← Назад к каталогу
        </Link>
        <span aria-hidden>/</span>
        <span className="truncate text-zinc-700 dark:text-zinc-200">
          {header.name}
        </span>
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Карточка SKU
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {header.name}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {header.dosageForm} · {header.category}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {header.abcClass ? (
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${abcStyles[header.abcClass]}`}
            >
              ABC: {header.abcClass}
            </span>
          ) : null}
          <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-200 dark:ring-zinc-700">
            {STORAGE_LABELS[header.storageCondition] ?? header.storageCondition}
          </span>
        </div>
      </header>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PassportRow label="Поставщик" value={header.supplier} />
        <PassportRow
          label="Lead time"
          value={`${header.leadTimeDays} дн.`}
        />
        <PassportRow
          label="Срок годности"
          value={`${header.shelfLifeDays} дн.`}
        />
        <PassportRow
          label="Уровень сервиса"
          value={formatPercent(header.serviceLevel)}
        />
        <PassportRow
          label="Стоимость единицы"
          value={`${formatCurrency(header.unitCost)} / ${header.unit}`}
        />
        <PassportRow
          label="Стоимость заказа"
          value={formatCurrency(header.orderCost)}
        />
        <PassportRow
          label="Ставка хранения"
          value={formatPercent(header.holdingCostRate)}
        />
        <PassportRow label="Единица измерения" value={header.unit} />
      </dl>
    </section>
  );
}
