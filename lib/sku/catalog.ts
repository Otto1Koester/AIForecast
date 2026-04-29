import type {
  SkuCatalogSortDirection,
  SkuCatalogSortField,
  SkuListItem,
  SkuListResponse,
} from "@/types/api";
import type { AbcClass, StorageCondition } from "@/types/inventory";
import { mapSkuListItem } from "@/lib/sku/mappers";
import { calculateSkuMetrics } from "@/lib/sku/metrics";
import type { SkuDataBundle } from "@/lib/sku/types";

const SORT_FIELDS: readonly SkuCatalogSortField[] = [
  "name",
  "category",
  "currentStock",
  "daysCoverage",
  "inventoryValue",
  "abcClass",
  "stockoutRisk",
];

const SORT_DIRECTIONS: readonly SkuCatalogSortDirection[] = ["asc", "desc"];
const ABC_CLASSES: readonly AbcClass[] = ["A", "B", "C"];
const STORAGE_CONDITIONS: readonly StorageCondition[] = [
  "room_temperature",
  "cool",
  "refrigerated",
  "frozen",
  "controlled",
];
const RISK_ORDER = new Map([
  ["low", 1],
  ["medium", 2],
  ["high", 3],
  ["critical", 4],
]);

function readStringParam(searchParams: URLSearchParams, name: string): string | null {
  const value = searchParams.get(name)?.trim();
  return value ? value : null;
}

function readSortField(searchParams: URLSearchParams): SkuCatalogSortField {
  const value = searchParams.get("sortBy");
  return value && (SORT_FIELDS as readonly string[]).includes(value)
    ? (value as SkuCatalogSortField)
    : "name";
}

function readSortDirection(
  searchParams: URLSearchParams,
): SkuCatalogSortDirection {
  const value = searchParams.get("sortDirection");
  return value && (SORT_DIRECTIONS as readonly string[]).includes(value)
    ? (value as SkuCatalogSortDirection)
    : "asc";
}

function readPositiveInteger(
  searchParams: URLSearchParams,
  name: string,
  fallback: number,
): number {
  const value = Number(searchParams.get(name));
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

function compareNullableNumber(
  left: number | null,
  right: number | null,
): number {
  if (left === null && right === null) {
    return 0;
  }

  if (left === null) {
    return 1;
  }

  if (right === null) {
    return -1;
  }

  return left - right;
}

function compareRisk(left: string | null, right: string | null): number {
  return (RISK_ORDER.get(left ?? "") ?? 0) - (RISK_ORDER.get(right ?? "") ?? 0);
}

function applyFilters(
  items: SkuListItem[],
  searchParams: URLSearchParams,
): SkuListItem[] {
  const search = readStringParam(searchParams, "search")?.toLowerCase();
  const category = readStringParam(searchParams, "category");
  const storageCondition = readStringParam(searchParams, "storageCondition");
  const abcClass = readStringParam(searchParams, "abcClass");
  const risk = readStringParam(searchParams, "risk");

  return items.filter((item) => {
    if (
      search &&
      !`${item.name} ${item.dosageForm} ${item.category}`
        .toLowerCase()
        .includes(search)
    ) {
      return false;
    }

    if (category && item.category !== category) {
      return false;
    }

    if (
      storageCondition &&
      (STORAGE_CONDITIONS as readonly string[]).includes(storageCondition) &&
      item.storageCondition !== storageCondition
    ) {
      return false;
    }

    if (
      abcClass &&
      (ABC_CLASSES as readonly string[]).includes(abcClass) &&
      item.abcClass !== abcClass
    ) {
      return false;
    }

    if (
      risk &&
      item.stockoutRisk !== risk &&
      item.overstockRisk !== risk &&
      item.expiryRisk !== risk
    ) {
      return false;
    }

    return true;
  });
}

function applySort(
  items: SkuListItem[],
  sortBy: SkuCatalogSortField,
  sortDirection: SkuCatalogSortDirection,
): SkuListItem[] {
  const direction = sortDirection === "asc" ? 1 : -1;

  return [...items].sort((left, right) => {
    let result = 0;

    if (sortBy === "name" || sortBy === "category") {
      result = left[sortBy].localeCompare(right[sortBy]);
    } else if (sortBy === "daysCoverage") {
      result = compareNullableNumber(left.daysCoverage, right.daysCoverage);
    } else if (sortBy === "abcClass") {
      result = (left.abcClass ?? "C").localeCompare(right.abcClass ?? "C");
    } else if (sortBy === "stockoutRisk") {
      result = compareRisk(left.stockoutRisk, right.stockoutRisk);
    } else {
      result = left[sortBy] - right[sortBy];
    }

    return result * direction;
  });
}

export function createSkuListResponse(
  bundle: SkuDataBundle,
  searchParams: URLSearchParams,
): SkuListResponse {
  const metricsBySkuId = calculateSkuMetrics(
    bundle.skus,
    bundle.lotsBySkuId,
    bundle.movementsBySkuId,
  );
  const allItems = bundle.skus.map((sku) => {
    const metrics = metricsBySkuId.get(sku.id);

    if (!metrics) {
      throw new Error(`Missing computed metrics for SKU ${sku.id}`);
    }

    return mapSkuListItem(
      sku,
      metrics,
      bundle.latestForecastsBySkuId.get(sku.id),
    );
  });
  const sortBy = readSortField(searchParams);
  const sortDirection = readSortDirection(searchParams);
  const page = readPositiveInteger(searchParams, "page", 1);
  const pageSize = readPositiveInteger(searchParams, "pageSize", allItems.length || 20);
  const filteredItems = applyFilters(allItems, searchParams);
  const sortedItems = applySort(filteredItems, sortBy, sortDirection);
  const start = (page - 1) * pageSize;
  const pagedItems = sortedItems.slice(start, start + pageSize);

  return {
    items: pagedItems,
    meta: {
      total: filteredItems.length,
      page,
      pageSize,
      hasNextPage: start + pageSize < filteredItems.length,
      generatedAt: new Date().toISOString(),
    },
  };
}
