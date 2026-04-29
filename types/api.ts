import type {
  AiForecastAnalysis,
  AiRecommendation,
  AiRecommendationAction,
  AiRecommendationPriority,
  AiRiskLevel,
  AiTrend,
} from "@/types/ai";
import type {
  AbcClass,
  InventoryLot,
  InventoryMovement,
  SkuItem,
  StorageCondition,
} from "@/types/inventory";

// ---------------------------------------------------------------------------
// Common shared primitives
// ---------------------------------------------------------------------------

/**
 * Standard error envelope for any AIForecast API endpoint.
 * Endpoints should always return this shape on non-2xx responses.
 */
export type ApiErrorResponse = {
  error: string;
  code?: string;
  details?: Record<string, unknown>;
};

/**
 * Risk severity used across dashboard, SKU lists and SKU details.
 * Aliased to the AI engine's risk level so that DTOs and AI output stay
 * compatible without conversion.
 */
export type RiskLevel = AiRiskLevel;

/**
 * Recommendation urgency aligned with the AI engine output.
 */
export type PriorityLevel = AiRecommendationPriority;

/**
 * Re-export of the canonical ABC class so API consumers do not need to
 * import from two different modules.
 */
export type { AbcClass };

/**
 * Direction of demand trend, aligned with AI engine output.
 */
export type TrendDirection = AiTrend;

/**
 * Compact view of all three risk dimensions used in cards, tables and
 * SKU details.
 */
export type RiskSummary = {
  stockout: RiskLevel;
  overstock: RiskLevel;
  expiry: RiskLevel;
};

/**
 * Lightweight summary of the most recent AI forecast for a SKU.
 * Used in lists, dashboard widgets and SKU detail headers.
 */
export type LatestAiForecastSummary = {
  forecastId: string;
  model: string;
  createdAt: string;
  confidence: number | null;
  forecast1m: number;
  forecast3m: number;
  forecast6m: number;
  trend: TrendDirection;
};

/**
 * Compact view of a single AI recommendation used in lists/cards.
 */
export type RecommendationSummary = {
  action: AiRecommendationAction;
  priority: PriorityLevel;
  suggestedQuantity?: number;
  deadlineDays?: number;
  reasoning: string;
};

// ---------------------------------------------------------------------------
// Dashboard DTOs
// ---------------------------------------------------------------------------

export type DashboardKpiTone = "neutral" | "success" | "warning" | "danger";

/**
 * Single KPI tile shown on the dashboard (total SKUs, stockout risk count,
 * overstock value, write-off potential, etc.).
 */
export type DashboardKpi = {
  id: string;
  title: string;
  value: number | string;
  unit?: string;
  description?: string;
  trendLabel?: string;
  tone?: DashboardKpiTone;
};

/**
 * AI-generated alert entry shown in the dashboard alerts panel.
 */
export type DashboardAlert = {
  id: string;
  skuId: string;
  skuName: string;
  level: RiskLevel;
  title: string;
  message: string;
  recommendedAction?: AiRecommendationAction;
  createdAt: string;
};

/**
 * Aggregated SKU row in the ABC analysis widget.
 */
export type DashboardAbcItem = {
  abcClass: AbcClass;
  skuCount: number;
  inventoryValue: number;
  share: number;
};

/**
 * Single row in the "days of coverage" widget.
 */
export type DashboardCoverageItem = {
  skuId: string;
  skuName: string;
  daysCoverage: number | null;
  currentStock: number;
  unit: string;
  stockoutRisk: RiskLevel;
};

/**
 * Single point on the dashboard "forecast vs fact" chart.
 */
export type DashboardForecastVsFactPoint = {
  period: string;
  forecast: number | null;
  fact: number | null;
};

/**
 * Top SKU at risk row in the dashboard table.
 */
export type DashboardTopRiskSku = {
  skuId: string;
  skuName: string;
  abcClass: AbcClass;
  daysCoverage: number | null;
  stockoutRisk: RiskLevel;
  overstockRisk: RiskLevel;
  expiryRisk: RiskLevel;
  primaryRecommendation?: RecommendationSummary;
};

export type DashboardAiStatus = {
  hasForecasts: boolean;
  totalForecasts: number;
  lastForecastAt: string | null;
  lastForecastModel: string | null;
  pendingRuns: number;
  failedRuns: number;
};

/**
 * Aggregate dashboard payload returned by the dashboard endpoint.
 * Designed to drive every block of the dashboard page in a single fetch.
 */
export type DashboardResponse = {
  generatedAt: string;
  kpis: DashboardKpi[];
  alerts: DashboardAlert[];
  abcAnalysis: DashboardAbcItem[];
  coverage: DashboardCoverageItem[];
  forecastVsFact: DashboardForecastVsFactPoint[];
  topRiskSkus: DashboardTopRiskSku[];
  aiStatus: DashboardAiStatus;
};

// ---------------------------------------------------------------------------
// SKU catalog DTOs
// ---------------------------------------------------------------------------

/**
 * Row of the SKU catalog table.
 *
 * Combines static SKU data, current inventory metrics and the latest AI
 * recommendations so the catalog can render KPIs and risks without extra
 * round-trips.
 */
export type SkuListItem = {
  id: SkuItem["id"];
  name: SkuItem["name"];
  dosageForm: SkuItem["dosageForm"];
  category: SkuItem["category"];
  storageCondition: StorageCondition;
  shelfLifeDays: SkuItem["shelfLifeDays"];
  currentStock: SkuItem["currentStock"];
  unit: SkuItem["unit"];
  unitCost: SkuItem["unitCost"];
  inventoryValue: number;
  daysCoverage: number | null;
  abcClass: AbcClass | null;
  rop: number | null;
  eoq: number | null;
  stockoutRisk: RiskLevel | null;
  overstockRisk: RiskLevel | null;
  expiryRisk: RiskLevel | null;
  primaryRecommendation: RecommendationSummary | null;
  latestForecastCreatedAt: string | null;
};

/**
 * Pagination / aggregate metadata for the SKU catalog.
 */
export type SkuListMeta = {
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  generatedAt: string;
};

export type SkuListResponse = {
  items: SkuListItem[];
  meta: SkuListMeta;
};

export type SkuCatalogSortField =
  | "name"
  | "category"
  | "currentStock"
  | "daysCoverage"
  | "inventoryValue"
  | "abcClass"
  | "stockoutRisk";

export type SkuCatalogSortDirection = "asc" | "desc";

/**
 * UI-side filter state for the SKU catalog. Kept here so that the data
 * layer and the UI layer can agree on the exact set of supported filters.
 */
export type SkuCatalogFiltersState = {
  search: string;
  category: string | null;
  storageCondition: StorageCondition | null;
  abcClass: AbcClass | null;
  stockoutRisk: RiskLevel | null;
  overstockRisk: RiskLevel | null;
  expiryRisk: RiskLevel | null;
  sortBy: SkuCatalogSortField;
  sortDirection: SkuCatalogSortDirection;
  page: number;
  pageSize: number;
};

// ---------------------------------------------------------------------------
// SKU detail DTOs
// ---------------------------------------------------------------------------

/**
 * SKU passport block at the top of the SKU detail page.
 */
export type SkuDetailHeader = {
  id: SkuItem["id"];
  name: SkuItem["name"];
  dosageForm: SkuItem["dosageForm"];
  category: SkuItem["category"];
  storageCondition: StorageCondition;
  shelfLifeDays: SkuItem["shelfLifeDays"];
  unit: SkuItem["unit"];
  unitCost: SkuItem["unitCost"];
  orderCost: SkuItem["orderCost"];
  holdingCostRate: SkuItem["holdingCostRate"];
  leadTimeDays: SkuItem["leadTimeDays"];
  serviceLevel: SkuItem["serviceLevel"];
  supplier: SkuItem["supplier"];
  abcClass: AbcClass | null;
};

/**
 * Single inventory lot row, enriched with derived expiry information.
 */
export type SkuLotDto = InventoryLot & {
  daysToExpiry: number | null;
  isExpired: boolean;
};

/**
 * Single inventory movement row used in the SKU detail history table.
 */
export type SkuMovementDto = InventoryMovement;

/**
 * Headline metric on the SKU detail page (current stock, days coverage,
 * inventory value, etc.).
 */
export type SkuDetailMetric = {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  description?: string;
  tone?: DashboardKpiTone;
};

/**
 * Single point on the SKU "forecast vs fact" chart.
 */
export type SkuForecastVsFactPoint = {
  period: string;
  forecast: number | null;
  fact: number | null;
};

/**
 * Compact recap of reorder calculations for the SKU detail page.
 */
export type SkuReorderInfo = {
  rop: number | null;
  eoq: number | null;
  safetyStock: number | null;
  leadTimeDemand: number | null;
  explanation: string | null;
};

/**
 * Latest AI forecast block exposed on the SKU detail page.
 * Includes both the high-level summary and the full AI analysis so that
 * UI can render charts and explanations without an extra request.
 */
export type SkuLatestAiForecast = {
  summary: LatestAiForecastSummary;
  analysis: AiForecastAnalysis;
  recommendations: AiRecommendation[];
};

/**
 * Technical metadata about the last AI run, exposed to power users on
 * the SKU detail page (model name, hashes, timestamps, status).
 */
export type SkuAiTechnicalMetadata = {
  forecastId: string | null;
  runId: string | null;
  model: string | null;
  inputHash: string | null;
  status: "pending" | "success" | "error" | "missing";
  errorMessage: string | null;
  createdAt: string | null;
  finishedAt: string | null;
};

/**
 * Full payload powering the SKU detail page in a single fetch.
 */
export type SkuDetailResponse = {
  header: SkuDetailHeader;
  metrics: SkuDetailMetric[];
  lots: SkuLotDto[];
  movements: SkuMovementDto[];
  forecastVsFact: SkuForecastVsFactPoint[];
  reorder: SkuReorderInfo;
  risks: RiskSummary | null;
  recommendations: RecommendationSummary[];
  latestAiForecast: SkuLatestAiForecast | null;
  aiMetadata: SkuAiTechnicalMetadata;
};

// ---------------------------------------------------------------------------
// AI action DTOs
// ---------------------------------------------------------------------------

/**
 * Response of POST /api/ai/sku/[id]/recalculate (single-SKU recompute).
 */
export type AiRecalculateResponse = {
  skuId: string;
  forecastId: string;
  runId: string;
  status: "success" | "error";
  cached: boolean;
  model: string;
  createdAt: string;
  errorMessage?: string;
  forecast?: LatestAiForecastSummary;
};

/**
 * Single SKU result inside a batch recalculation response.
 */
export type AiBatchForecastItem = {
  skuId: string;
  status: "success" | "error" | "skipped";
  forecastId?: string;
  runId?: string;
  cached?: boolean;
  errorMessage?: string;
};

/**
 * Response of POST /api/ai/forecast/batch.
 */
export type AiBatchForecastResponse = {
  startedAt: string;
  finishedAt: string;
  model: string;
  totalRequested: number;
  successCount: number;
  errorCount: number;
  skippedCount: number;
  items: AiBatchForecastItem[];
};
