"use client";

import type { ChangeEvent, ReactNode } from "react";

import type {
  RiskLevel,
  SkuCatalogSortDirection,
} from "@/types/api";
import type { AbcClass, StorageCondition } from "@/types/inventory";

import {
  ABC_LABELS,
  RISK_OPTIONS,
  STORAGE_LABELS,
} from "./labels";
import {
  type CatalogFiltersState,
  type CatalogSortField,
  DEFAULT_FILTERS,
  SORT_OPTIONS,
} from "./sorting";

type SkuCatalogToolbarProps = {
  filters: CatalogFiltersState;
  onChange: (next: CatalogFiltersState) => void;
  categories: string[];
  storageConditions: string[];
  matchedCount: number;
  totalCount: number;
};

const inputClass =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-400 dark:focus:ring-zinc-800";

const selectClass = inputClass;

const labelClass =
  "block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400";

function isRiskLevel(value: string): value is RiskLevel {
  return value === "low" || value === "medium" || value === "high" || value === "critical";
}

function isAbcClass(value: string): value is AbcClass {
  return value === "A" || value === "B" || value === "C";
}

export function SkuCatalogToolbar({
  filters,
  onChange,
  categories,
  storageConditions,
  matchedCount,
  totalCount,
}: SkuCatalogToolbarProps): ReactNode {
  function update<K extends keyof CatalogFiltersState>(
    key: K,
    value: CatalogFiltersState[K],
  ) {
    onChange({ ...filters, [key]: value, page: 1 });
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    update("search", event.target.value);
  }

  function handleCategory(event: ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value || null;
    update("category", next);
  }

  function handleStorage(event: ChangeEvent<HTMLSelectElement>) {
    const next = (event.target.value || null) as StorageCondition | null;
    update("storageCondition", next);
  }

  function handleAbc(event: ChangeEvent<HTMLSelectElement>) {
    const raw = event.target.value;
    update("abcClass", raw && isAbcClass(raw) ? raw : null);
  }

  function handleRisk<K extends "stockoutRisk" | "overstockRisk" | "expiryRisk">(
    key: K,
  ) {
    return (event: ChangeEvent<HTMLSelectElement>) => {
      const raw = event.target.value;
      update(key, raw && isRiskLevel(raw) ? raw : null);
    };
  }

  function handleSortField(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value as CatalogSortField;
    const option = SORT_OPTIONS.find((o) => o.value === value);
    onChange({
      ...filters,
      sortBy: value,
      sortDirection: option?.defaultDirection ?? filters.sortDirection,
      page: 1,
    });
  }

  function handleSortDirection(event: ChangeEvent<HTMLSelectElement>) {
    update(
      "sortDirection",
      event.target.value as SkuCatalogSortDirection,
    );
  }

  function handleReset() {
    onChange({ ...DEFAULT_FILTERS });
  }

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.category !== null ||
    filters.storageCondition !== null ||
    filters.abcClass !== null ||
    filters.stockoutRisk !== null ||
    filters.overstockRisk !== null ||
    filters.expiryRisk !== null ||
    filters.sortBy !== DEFAULT_FILTERS.sortBy ||
    filters.sortDirection !== DEFAULT_FILTERS.sortDirection;

  return (
    <section
      aria-label="Поиск и фильтры"
      className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr]">
        <div className="space-y-1.5">
          <label htmlFor="sku-search" className={labelClass}>
            Поиск
          </label>
          <input
            id="sku-search"
            type="search"
            value={filters.search}
            onChange={handleSearch}
            placeholder="Название, категория или условия хранения"
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="sku-sort-field" className={labelClass}>
            Сортировка
          </label>
          <select
            id="sku-sort-field"
            value={filters.sortBy}
            onChange={handleSortField}
            className={selectClass}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="sku-sort-direction" className={labelClass}>
            Направление
          </label>
          <select
            id="sku-sort-direction"
            value={filters.sortDirection}
            onChange={handleSortDirection}
            className={selectClass}
          >
            <option value="desc">По убыванию</option>
            <option value="asc">По возрастанию</option>
          </select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <label htmlFor="sku-filter-abc" className={labelClass}>
            ABC-класс
          </label>
          <select
            id="sku-filter-abc"
            value={filters.abcClass ?? ""}
            onChange={handleAbc}
            className={selectClass}
          >
            <option value="">Все ABC</option>
            {(["A", "B", "C"] as const).map((value) => (
              <option key={value} value={value}>
                {ABC_LABELS[value]}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="sku-filter-stockout" className={labelClass}>
            Риск дефицита
          </label>
          <select
            id="sku-filter-stockout"
            value={filters.stockoutRisk ?? ""}
            onChange={handleRisk("stockoutRisk")}
            className={selectClass}
          >
            <option value="">Любой риск</option>
            {RISK_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="sku-filter-storage" className={labelClass}>
            Условия хранения
          </label>
          <select
            id="sku-filter-storage"
            value={filters.storageCondition ?? ""}
            onChange={handleStorage}
            className={selectClass}
          >
            <option value="">Все условия</option>
            {storageConditions.map((value) => (
              <option key={value} value={value}>
                {STORAGE_LABELS[value as StorageCondition] ?? value}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="sku-filter-category" className={labelClass}>
            Категория
          </label>
          <select
            id="sku-filter-category"
            value={filters.category ?? ""}
            onChange={handleCategory}
            className={selectClass}
          >
            <option value="">Все категории</option>
            {categories.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-zinc-500 dark:text-zinc-400">
        <span>
          Показано <strong className="text-zinc-700 dark:text-zinc-200">{matchedCount}</strong> из {totalCount}
        </span>
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasActiveFilters}
          className="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Сбросить фильтры
        </button>
      </div>
    </section>
  );
}
