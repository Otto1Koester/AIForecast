import type {
  RiskLevel,
  SkuCatalogFiltersState,
  SkuCatalogSortDirection,
  SkuCatalogSortField,
  SkuListItem,
} from "@/types/api";
import type { AbcClass } from "@/types/inventory";

export type CatalogSortField =
  | SkuCatalogSortField
  | "latestForecastCreatedAt";

export type CatalogFiltersState = Omit<SkuCatalogFiltersState, "sortBy"> & {
  sortBy: CatalogSortField;
};

export const DEFAULT_FILTERS: CatalogFiltersState = {
  search: "",
  category: null,
  storageCondition: null,
  abcClass: null,
  stockoutRisk: null,
  overstockRisk: null,
  expiryRisk: null,
  sortBy: "stockoutRisk",
  sortDirection: "desc",
  page: 1,
  pageSize: 20,
};

export const SORT_OPTIONS: ReadonlyArray<{
  value: CatalogSortField;
  label: string;
  defaultDirection: SkuCatalogSortDirection;
}> = [
  { value: "stockoutRisk", label: "Риск дефицита", defaultDirection: "desc" },
  { value: "daysCoverage", label: "Дни покрытия", defaultDirection: "asc" },
  { value: "inventoryValue", label: "Стоимость запаса", defaultDirection: "desc" },
  { value: "currentStock", label: "Текущий остаток", defaultDirection: "desc" },
  {
    value: "latestForecastCreatedAt",
    label: "Последний AI-прогноз",
    defaultDirection: "desc",
  },
];

const RISK_WEIGHT: Record<RiskLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

const ABC_WEIGHT: Record<AbcClass, number> = { A: 1, B: 2, C: 3 };

function riskScore(level: RiskLevel | null | undefined): number {
  if (!level) {
    return 0;
  }
  return RISK_WEIGHT[level];
}

function abcScore(value: AbcClass | null | undefined): number {
  if (!value) {
    return 99;
  }
  return ABC_WEIGHT[value];
}

function timestampScore(value: string | null | undefined): number {
  if (!value) {
    return 0;
  }
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function nullableNumber(value: number | null | undefined, missingHigh: boolean): number {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return missingHigh ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  }
  return value;
}

function compareItems(
  a: SkuListItem,
  b: SkuListItem,
  field: CatalogSortField,
  direction: SkuCatalogSortDirection,
): number {
  const sign = direction === "asc" ? 1 : -1;

  switch (field) {
    case "name": {
      return a.name.localeCompare(b.name, "ru") * sign;
    }
    case "category": {
      return a.category.localeCompare(b.category, "ru") * sign;
    }
    case "abcClass": {
      return (abcScore(a.abcClass) - abcScore(b.abcClass)) * sign;
    }
    case "currentStock": {
      return (
        (nullableNumber(a.currentStock, direction === "asc") -
          nullableNumber(b.currentStock, direction === "asc")) *
        sign
      );
    }
    case "inventoryValue": {
      return (
        (nullableNumber(a.inventoryValue, direction === "asc") -
          nullableNumber(b.inventoryValue, direction === "asc")) *
        sign
      );
    }
    case "daysCoverage": {
      return (
        (nullableNumber(a.daysCoverage, direction === "asc") -
          nullableNumber(b.daysCoverage, direction === "asc")) *
        sign
      );
    }
    case "stockoutRisk": {
      return (riskScore(a.stockoutRisk) - riskScore(b.stockoutRisk)) * sign;
    }
    case "latestForecastCreatedAt": {
      return (
        (timestampScore(a.latestForecastCreatedAt) -
          timestampScore(b.latestForecastCreatedAt)) *
        sign
      );
    }
    default: {
      return 0;
    }
  }
}

function matchesSearch(item: SkuListItem, search: string): boolean {
  if (!search.trim()) {
    return true;
  }
  const haystack = [
    item.name,
    item.category,
    item.dosageForm,
    item.storageCondition,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(search.trim().toLowerCase());
}

export function applyFiltersAndSort(
  items: SkuListItem[],
  filters: CatalogFiltersState,
): SkuListItem[] {
  const filtered = items.filter((item) => {
    if (!matchesSearch(item, filters.search)) {
      return false;
    }
    if (filters.category && item.category !== filters.category) {
      return false;
    }
    if (
      filters.storageCondition &&
      item.storageCondition !== filters.storageCondition
    ) {
      return false;
    }
    if (filters.abcClass && item.abcClass !== filters.abcClass) {
      return false;
    }
    if (filters.stockoutRisk && item.stockoutRisk !== filters.stockoutRisk) {
      return false;
    }
    if (filters.overstockRisk && item.overstockRisk !== filters.overstockRisk) {
      return false;
    }
    if (filters.expiryRisk && item.expiryRisk !== filters.expiryRisk) {
      return false;
    }
    return true;
  });

  return filtered.sort((a, b) =>
    compareItems(a, b, filters.sortBy, filters.sortDirection),
  );
}

export function uniqueCategories(items: SkuListItem[]): string[] {
  const set = new Set<string>();
  for (const item of items) {
    if (item.category) {
      set.add(item.category);
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, "ru"));
}

export function uniqueStorageConditions(
  items: SkuListItem[],
): string[] {
  const set = new Set<string>();
  for (const item of items) {
    if (item.storageCondition) {
      set.add(item.storageCondition);
    }
  }
  return Array.from(set);
}
