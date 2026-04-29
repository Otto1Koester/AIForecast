import Link from "next/link";
import type { ReactNode } from "react";

import { RiskBadge } from "@/components/ui/RiskBadge";
import type { SkuListItem } from "@/types/api";
import type { StorageCondition } from "@/types/inventory";

import {
  ACTION_LABELS,
  PRIORITY_LABELS,
  STORAGE_LABELS,
  formatCurrency,
  formatDecimal,
  formatInteger,
  formatStockWithUnit,
} from "./labels";

type SkuCatalogCardGridProps = {
  items: SkuListItem[];
};

function RiskRow({ item }: { item: SkuListItem }): ReactNode {
  const blocks: Array<{ label: string; level: SkuListItem["stockoutRisk"] }> = [
    { label: "Дефицит", level: item.stockoutRisk },
    { label: "Затоварка", level: item.overstockRisk },
    { label: "Срок", level: item.expiryRisk },
  ];

  return (
    <div className="flex flex-wrap gap-1.5">
      {blocks.map((block) =>
        block.level ? (
          <RiskBadge
            key={block.label}
            level={block.level}
            label={`${block.label}: ${block.level}`}
          />
        ) : (
          <span
            key={block.label}
            className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:ring-zinc-700"
          >
            {block.label}: нет прогноза
          </span>
        ),
      )}
    </div>
  );
}

export function SkuCatalogCardGrid({
  items,
}: SkuCatalogCardGridProps): ReactNode {
  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li
          key={item.id}
          className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <Link
                href={`/sku/${item.id}`}
                className="text-base font-semibold text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-50"
              >
                {item.name}
              </Link>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {item.dosageForm} · {item.category}
              </p>
            </div>
            {item.abcClass ? (
              <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-200 dark:ring-zinc-700">
                ABC {item.abcClass}
              </span>
            ) : null}
          </div>

          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            {STORAGE_LABELS[item.storageCondition as StorageCondition] ??
              item.storageCondition}
          </p>

          <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Остаток</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                {formatStockWithUnit(item.currentStock, item.unit)}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Стоимость</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                {formatCurrency(item.inventoryValue)}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Дни покрытия</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                {item.daysCoverage === null
                  ? "—"
                  : `${formatDecimal(item.daysCoverage)} дн.`}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">ROP / EOQ</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                {item.rop === null && item.eoq === null
                  ? "AI не рассчитан"
                  : `${formatInteger(item.rop)} / ${formatInteger(item.eoq)}`}
              </dd>
            </div>
          </dl>

          <div className="mt-3 space-y-2">
            <RiskRow item={item} />
            {item.primaryRecommendation ? (
              <div className="rounded-md bg-zinc-50 p-2.5 text-xs dark:bg-zinc-900/50">
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {ACTION_LABELS[item.primaryRecommendation.action]}{" "}
                  <span className="font-normal text-zinc-500 dark:text-zinc-400">
                    · {PRIORITY_LABELS[item.primaryRecommendation.priority]}
                  </span>
                </p>
                <p className="mt-1 line-clamp-2 text-zinc-600 dark:text-zinc-300">
                  {item.primaryRecommendation.reasoning}
                </p>
              </div>
            ) : (
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                AI-рекомендация ещё не рассчитана
              </p>
            )}
          </div>

          <div className="mt-3 flex justify-end">
            <Link
              href={`/sku/${item.id}`}
              className="inline-flex items-center rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Открыть карточку
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
