"use client";

import { useRouter } from "next/navigation";
import type { KeyboardEvent, ReactNode } from "react";

import { AbcBadge } from "@/components/ui/AbcBadge";
import { RiskBadge } from "@/components/ui/RiskBadge";
import type { RecommendationSummary, SkuListItem } from "@/types/api";
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

type SkuCatalogTableProps = {
  items: SkuListItem[];
};

const headerCellClass =
  "px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400";

const bodyCellClass =
  "px-3 py-3 align-top text-sm text-zinc-700 dark:text-zinc-200";

function RiskCell({
  level,
  label,
}: {
  level: SkuListItem["stockoutRisk"];
  label: string;
}): ReactNode {
  if (!level) {
    return (
      <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:ring-zinc-700">
        Нет прогноза
      </span>
    );
  }
  return <RiskBadge level={level} label={`${label}: ${riskShort(level)}`} />;
}

function riskShort(level: NonNullable<SkuListItem["stockoutRisk"]>): string {
  switch (level) {
    case "low":
      return "низкий";
    case "medium":
      return "средний";
    case "high":
      return "высокий";
    case "critical":
      return "критический";
  }
}

function RecommendationCell({
  value,
}: {
  value: RecommendationSummary | null;
}): ReactNode {
  if (!value) {
    return (
      <span className="text-xs text-zinc-400 dark:text-zinc-500">
        AI-рекомендация не рассчитана
      </span>
    );
  }
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
        {ACTION_LABELS[value.action]}
        <span className="ml-2 text-xs font-normal text-zinc-500 dark:text-zinc-400">
          приоритет {PRIORITY_LABELS[value.priority]}
        </span>
      </p>
      <p className="line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
        {value.reasoning}
      </p>
    </div>
  );
}

export function SkuCatalogTable({ items }: SkuCatalogTableProps): ReactNode {
  const router = useRouter();

  function navigate(skuId: string) {
    router.push(`/sku/${skuId}`);
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLTableRowElement>,
    skuId: string,
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate(skuId);
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <table className="min-w-[1100px] w-full border-collapse text-left">
        <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40">
          <tr>
            <th scope="col" className={headerCellClass}>
              Препарат
            </th>
            <th scope="col" className={headerCellClass}>
              Форма / Категория
            </th>
            <th scope="col" className={headerCellClass}>
              Хранение
            </th>
            <th scope="col" className={`${headerCellClass} text-right`}>
              Остаток
            </th>
            <th scope="col" className={`${headerCellClass} text-right`}>
              Стоимость
            </th>
            <th scope="col" className={`${headerCellClass} text-right`}>
              Дни покрытия
            </th>
            <th scope="col" className={headerCellClass}>
              ABC
            </th>
            <th scope="col" className={`${headerCellClass} text-right`}>
              ROP / EOQ
            </th>
            <th scope="col" className={headerCellClass}>
              Риски
            </th>
            <th scope="col" className={headerCellClass}>
              AI-рекомендация
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {items.map((item) => (
            <tr
              key={item.id}
              role="link"
              tabIndex={0}
              onClick={() => navigate(item.id)}
              onKeyDown={(event) => handleKeyDown(event, item.id)}
              aria-label={`Открыть карточку ${item.name}`}
              className="cursor-pointer transition-colors hover:bg-zinc-50 focus:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 dark:hover:bg-zinc-900/40 dark:focus:bg-zinc-900/40"
            >
              <td className={bodyCellClass}>
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  {item.name}
                </span>
              </td>
              <td className={bodyCellClass}>
                <p>{item.dosageForm}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {item.category}
                </p>
              </td>
              <td className={bodyCellClass}>
                <span className="text-xs text-zinc-600 dark:text-zinc-300">
                  {STORAGE_LABELS[item.storageCondition as StorageCondition] ??
                    item.storageCondition}
                </span>
              </td>
              <td className={`${bodyCellClass} text-right tabular-nums`}>
                {formatStockWithUnit(item.currentStock, item.unit)}
              </td>
              <td className={`${bodyCellClass} text-right tabular-nums`}>
                {formatCurrency(item.inventoryValue)}
              </td>
              <td className={`${bodyCellClass} text-right tabular-nums`}>
                {item.daysCoverage === null ? (
                  <span className="text-zinc-400 dark:text-zinc-500">—</span>
                ) : (
                  <span>{formatDecimal(item.daysCoverage)} дн.</span>
                )}
              </td>
              <td className={bodyCellClass}>
                <AbcBadge value={item.abcClass} />
              </td>
              <td className={`${bodyCellClass} text-right tabular-nums`}>
                {item.rop === null && item.eoq === null ? (
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    AI не рассчитан
                  </span>
                ) : (
                  <div className="space-y-0.5 text-xs">
                    <p>
                      <span className="text-zinc-500 dark:text-zinc-400">ROP:</span>{" "}
                      {formatInteger(item.rop)}
                    </p>
                    <p>
                      <span className="text-zinc-500 dark:text-zinc-400">EOQ:</span>{" "}
                      {formatInteger(item.eoq)}
                    </p>
                  </div>
                )}
              </td>
              <td className={bodyCellClass}>
                <div className="flex flex-wrap gap-1.5">
                  <RiskCell level={item.stockoutRisk} label="Дефицит" />
                  <RiskCell level={item.overstockRisk} label="Затоваривание" />
                  <RiskCell level={item.expiryRisk} label="Срок годности" />
                </div>
              </td>
              <td className={`${bodyCellClass} max-w-[260px]`}>
                <RecommendationCell value={item.primaryRecommendation} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
