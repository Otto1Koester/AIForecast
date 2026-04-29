import type {
  AiForecastAnalysis,
  AiForecastRunStatus,
  AiRiskLevel,
} from "@/types/ai";
import type {
  InventoryLot,
  InventoryMovement,
  SkuItem,
  StorageCondition,
} from "@/types/inventory";

export type NumericValue = number | string;

export type SkuItemRow = {
  id: string;
  name: string;
  dosage_form: string;
  category: string;
  storage_condition: string;
  shelf_life_days: number;
  current_stock: NumericValue;
  unit: string;
  unit_cost: NumericValue;
  order_cost: NumericValue;
  holding_cost_rate: NumericValue;
  lead_time_days: number;
  service_level: NumericValue;
  supplier: string;
  created_at: string;
};

export type InventoryLotRow = {
  id: string;
  sku_id: string;
  lot_number: string;
  quantity: NumericValue;
  received_at: string;
  expires_at: string;
  created_at: string;
};

export type InventoryMovementRow = {
  id: string;
  sku_id: string;
  period_month: string;
  inbound_qty: NumericValue;
  outbound_qty: NumericValue;
  writeoff_qty: NumericValue;
  ending_stock: NumericValue;
  anomaly_flag: boolean | null;
  anomaly_note: string | null;
  created_at: string;
};

export type AiForecastRow = {
  id: string;
  sku_id: string;
  model: string;
  input_hash: string;
  forecast_1m: NumericValue;
  forecast_3m: NumericValue;
  forecast_6m: NumericValue;
  rop: NumericValue;
  eoq: NumericValue;
  stockout_risk: string;
  overstock_risk: string;
  expiry_risk: string;
  confidence: NumericValue | null;
  analysis: AiForecastAnalysis;
  created_at: string;
};

export type AiForecastRunRow = {
  id: string;
  sku_id: string | null;
  status: AiForecastRunStatus;
  model: string;
  input_hash: string | null;
  error_message: string | null;
  created_at: string;
  finished_at: string | null;
};

export type SkuDataBundle = {
  skus: SkuItem[];
  lotsBySkuId: Map<string, InventoryLot[]>;
  movementsBySkuId: Map<string, InventoryMovement[]>;
  latestForecastsBySkuId: Map<string, AiForecastRow>;
  latestRunsBySkuId: Map<string, AiForecastRunRow>;
};

export type SkuComputedMetrics = {
  inventoryValue: number;
  averageMonthlyOutbound: number;
  averageDailyOutbound: number;
  daysCoverage: number | null;
  abcClass: "A" | "B" | "C";
  quantityAtRisk90Days: number;
  quantityAtRisk180Days: number;
  nearestExpiryDays: number | null;
  referenceStockoutRisk: AiRiskLevel;
  referenceExpiryRisk: AiRiskLevel;
};

export type SkuMetricsById = Map<string, SkuComputedMetrics>;

export const STORAGE_CONDITIONS: readonly StorageCondition[] = [
  "room_temperature",
  "cool",
  "refrigerated",
  "frozen",
  "controlled",
];

export const RISK_LEVELS: readonly AiRiskLevel[] = [
  "low",
  "medium",
  "high",
  "critical",
];
