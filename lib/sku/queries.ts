import { createSupabaseAdminClient } from "@/lib/supabase/server";
import {
  mapInventoryLotRow,
  mapInventoryMovementRow,
  mapSkuRow,
  normalizeForecastAnalysis,
} from "@/lib/sku/mappers";
import type {
  AiForecastRow,
  AiForecastRunRow,
  InventoryLotRow,
  InventoryMovementRow,
  SkuDataBundle,
  SkuItemRow,
} from "@/lib/sku/types";
import type { InventoryLot, InventoryMovement, SkuItem } from "@/types/inventory";

const SKU_SELECT = `
  id,
  name,
  dosage_form,
  category,
  storage_condition,
  shelf_life_days,
  current_stock,
  unit,
  unit_cost,
  order_cost,
  holding_cost_rate,
  lead_time_days,
  service_level,
  supplier,
  created_at
`;

const LOT_SELECT = `
  id,
  sku_id,
  lot_number,
  quantity,
  received_at,
  expires_at,
  created_at
`;

const MOVEMENT_SELECT = `
  id,
  sku_id,
  period_month,
  inbound_qty,
  outbound_qty,
  writeoff_qty,
  ending_stock,
  anomaly_flag,
  anomaly_note,
  created_at
`;

const FORECAST_SELECT = `
  id,
  sku_id,
  model,
  input_hash,
  forecast_1m,
  forecast_3m,
  forecast_6m,
  rop,
  eoq,
  stockout_risk,
  overstock_risk,
  expiry_risk,
  confidence,
  analysis,
  created_at
`;

const RUN_SELECT = `
  id,
  sku_id,
  status,
  model,
  input_hash,
  error_message,
  created_at,
  finished_at
`;

function getSupabaseErrorMessage(action: string, message: string): Error {
  return new Error(`${action}: ${message}`);
}

function groupBySkuId<T extends { skuId: string }>(rows: T[]): Map<string, T[]> {
  const grouped = new Map<string, T[]>();

  for (const row of rows) {
    grouped.set(row.skuId, [...(grouped.get(row.skuId) ?? []), row]);
  }

  return grouped;
}

export async function fetchSkuItems(): Promise<SkuItem[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("sku_items")
    .select(SKU_SELECT)
    .order("name", { ascending: true });

  if (error) {
    throw getSupabaseErrorMessage("Failed to load SKU items", error.message);
  }

  return ((data ?? []) as SkuItemRow[]).map(mapSkuRow);
}

export async function fetchInventoryLotsBySkuIds(
  skuIds: string[],
): Promise<Map<string, InventoryLot[]>> {
  if (skuIds.length === 0) {
    return new Map();
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("inventory_lots")
    .select(LOT_SELECT)
    .in("sku_id", skuIds)
    .order("expires_at", { ascending: true });

  if (error) {
    throw getSupabaseErrorMessage("Failed to load inventory lots", error.message);
  }

  return groupBySkuId(((data ?? []) as InventoryLotRow[]).map(mapInventoryLotRow));
}

export async function fetchInventoryMovementsBySkuIds(
  skuIds: string[],
): Promise<Map<string, InventoryMovement[]>> {
  if (skuIds.length === 0) {
    return new Map();
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("inventory_movements")
    .select(MOVEMENT_SELECT)
    .in("sku_id", skuIds)
    .order("period_month", { ascending: true });

  if (error) {
    throw getSupabaseErrorMessage(
      "Failed to load inventory movements",
      error.message,
    );
  }

  return groupBySkuId(
    ((data ?? []) as InventoryMovementRow[]).map(mapInventoryMovementRow),
  );
}

export async function fetchLatestForecastsBySkuIds(
  skuIds: string[],
): Promise<Map<string, AiForecastRow>> {
  if (skuIds.length === 0) {
    return new Map();
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("ai_forecasts")
    .select(FORECAST_SELECT)
    .in("sku_id", skuIds)
    .order("sku_id", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw getSupabaseErrorMessage("Failed to load AI forecasts", error.message);
  }

  const latestBySkuId = new Map<string, AiForecastRow>();

  for (const row of (data ?? []) as AiForecastRow[]) {
    if (!latestBySkuId.has(row.sku_id)) {
      latestBySkuId.set(row.sku_id, {
        ...row,
        analysis: normalizeForecastAnalysis(row.analysis),
      });
    }
  }

  return latestBySkuId;
}

export async function fetchLatestRunsBySkuIds(
  skuIds: string[],
): Promise<Map<string, AiForecastRunRow>> {
  if (skuIds.length === 0) {
    return new Map();
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("ai_forecast_runs")
    .select(RUN_SELECT)
    .in("sku_id", skuIds)
    .order("sku_id", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw getSupabaseErrorMessage("Failed to load AI forecast runs", error.message);
  }

  const latestBySkuId = new Map<string, AiForecastRunRow>();

  for (const row of (data ?? []) as AiForecastRunRow[]) {
    if (row.sku_id && !latestBySkuId.has(row.sku_id)) {
      latestBySkuId.set(row.sku_id, row);
    }
  }

  return latestBySkuId;
}

export async function fetchSkuDataBundle(): Promise<SkuDataBundle> {
  const skus = await fetchSkuItems();
  const skuIds = skus.map((sku) => sku.id);
  const [lotsBySkuId, movementsBySkuId, latestForecastsBySkuId, latestRunsBySkuId] =
    await Promise.all([
      fetchInventoryLotsBySkuIds(skuIds),
      fetchInventoryMovementsBySkuIds(skuIds),
      fetchLatestForecastsBySkuIds(skuIds),
      fetchLatestRunsBySkuIds(skuIds),
    ]);

  return {
    skus,
    lotsBySkuId,
    movementsBySkuId,
    latestForecastsBySkuId,
    latestRunsBySkuId,
  };
}

export async function fetchSkuDetailData(
  skuId: string,
): Promise<SkuDataBundle & { sku: SkuItem | null }> {
  const bundle = await fetchSkuDataBundle();
  const sku = bundle.skus.find((item) => item.id === skuId) ?? null;

  return {
    ...bundle,
    sku,
  };
}
