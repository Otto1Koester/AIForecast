"use client";

import { useRouter } from "next/navigation";
import type { KeyboardEvent, ReactNode } from "react";

import { AbcBadge } from "@/components/ui/AbcBadge";
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
    { label: "Затоваривание", level: item.overstockRisk },
    { label: "Срок годности", level: item.expiryRisk },
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
  const router = useRouter();

  function navigate(skuId: string) {
    router.push(`/sku/${skuId}`);
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLLIElement>,
    skuId: string,
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate(skuId);
    }
  }

  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li
          key={item.id}
          role="link"
          tabIndex={0}
          onClick={() => navigate(item.id)}
          onKeyDown={(event) => handleKeyDown(event, item.id)}
          aria-label={`Открыть карточку ${item.name}`}
          className="cursor-pointer rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-colors hover:bg-zinc-50 focus:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900/60 dark:focus:bg-zinc-900/60"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                {item.name}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {item.dosageForm} · {item.category}
              </p>
            </div>
            <AbcBadge value={item.abcClass} prefix="ABC" />
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
        </li>
      ))}
    </ul>
  );
}
