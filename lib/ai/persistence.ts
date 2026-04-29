import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { normalizeForecastAnalysis, toNumber, toRiskLevel } from "@/lib/sku/mappers";
import type {
  AiForecastAnalysis,
  AiForecastRecord,
  AiForecastRun,
  AiForecastRunStatus,
} from "@/types/ai";

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

type ForecastRow = {
  id: string;
  sku_id: string;
  model: string;
  input_hash: string;
  forecast_1m: number | string;
  forecast_3m: number | string;
  forecast_6m: number | string;
  rop: number | string;
  eoq: number | string;
  stockout_risk: string;
  overstock_risk: string;
  expiry_risk: string;
  confidence: number | string | null;
  analysis: unknown;
  created_at: string;
};

type ForecastRunRow = {
  id: string;
  sku_id: string | null;
  status: AiForecastRunStatus;
  model: string;
  input_hash: string | null;
  error_message: string | null;
  created_at: string;
  finished_at: string | null;
};

type InsertForecastInput = {
  skuId: string;
  model: string;
  inputHash: string;
  analysis: AiForecastAnalysis;
  rawResponse: unknown;
};

type InsertForecastRunInput = {
  skuId: string;
  model: string;
  inputHash: string;
};

type UpdateForecastRunInput = {
  status: AiForecastRunStatus;
  errorMessage?: string | null;
  finishedAt?: string | null;
};

function supabaseError(action: string, message: string): Error {
  return new Error(`${action}: ${message}`);
}

export function mapForecastRowToDto(row: ForecastRow): AiForecastRecord {
  const analysis = normalizeForecastAnalysis(row.analysis);

  return {
    id: row.id,
    skuId: row.sku_id,
    model: row.model,
    inputHash: row.input_hash,
    forecast1m: toNumber(row.forecast_1m),
    forecast3m: toNumber(row.forecast_3m),
    forecast6m: toNumber(row.forecast_6m),
    rop: toNumber(row.rop),
    eoq: toNumber(row.eoq),
    stockoutRisk: toRiskLevel(row.stockout_risk),
    overstockRisk: toRiskLevel(row.overstock_risk),
    expiryRisk: toRiskLevel(row.expiry_risk),
    confidence: row.confidence === null ? null : toNumber(row.confidence),
    analysis,
    createdAt: row.created_at,
  };
}

function mapForecastRunRowToDto(row: ForecastRunRow): AiForecastRun {
  return {
    id: row.id,
    skuId: row.sku_id ?? "",
    status: row.status,
    model: row.model,
    inputHash: row.input_hash,
    errorMessage: row.error_message,
    createdAt: row.created_at,
    finishedAt: row.finished_at,
  };
}

export async function getLatestForecastForSku(
  skuId: string,
): Promise<AiForecastRecord | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("ai_forecasts")
    .select(FORECAST_SELECT)
    .eq("sku_id", skuId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw supabaseError("Failed to load latest AI forecast", error.message);
  }

  return data ? mapForecastRowToDto(data as ForecastRow) : null;
}

export async function getLatestRunForSku(
  skuId: string,
): Promise<AiForecastRun | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("ai_forecast_runs")
    .select(RUN_SELECT)
    .eq("sku_id", skuId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw supabaseError("Failed to load latest AI forecast run", error.message);
  }

  return data ? mapForecastRunRowToDto(data as ForecastRunRow) : null;
}

export async function insertForecast(
  input: InsertForecastInput,
): Promise<AiForecastRecord> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("ai_forecasts")
    .insert({
      sku_id: input.skuId,
      model: input.model,
      input_hash: input.inputHash,
      forecast_1m: input.analysis.forecast.oneMonthDemand,
      forecast_3m: input.analysis.forecast.threeMonthDemand,
      forecast_6m: input.analysis.forecast.sixMonthDemand,
      rop: input.analysis.reorder.rop,
      eoq: input.analysis.reorder.eoq,
      stockout_risk: input.analysis.risks.stockout.level,
      overstock_risk: input.analysis.risks.overstock.level,
      expiry_risk: input.analysis.risks.expiry.level,
      confidence: input.analysis.forecast.confidence,
      analysis: input.analysis,
      raw_response: input.rawResponse,
    })
    .select(FORECAST_SELECT)
    .single();

  if (error) {
    throw supabaseError("Failed to save AI forecast", error.message);
  }

  return mapForecastRowToDto(data as ForecastRow);
}

export async function insertForecastRun(
  input: InsertForecastRunInput,
): Promise<AiForecastRun> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("ai_forecast_runs")
    .insert({
      sku_id: input.skuId,
      // The approved DB schema uses pending/success/error; pending is the live run state.
      status: "pending",
      model: input.model,
      input_hash: input.inputHash,
      error_message: null,
    })
    .select(RUN_SELECT)
    .single();

  if (error) {
    throw supabaseError("Failed to create AI forecast run", error.message);
  }

  return mapForecastRunRowToDto(data as ForecastRunRow);
}

export async function updateForecastRun(
  runId: string,
  input: UpdateForecastRunInput,
): Promise<AiForecastRun> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("ai_forecast_runs")
    .update({
      status: input.status,
      error_message: input.errorMessage ?? null,
      finished_at: input.finishedAt ?? null,
    })
    .eq("id", runId)
    .select(RUN_SELECT)
    .single();

  if (error) {
    throw supabaseError("Failed to update AI forecast run", error.message);
  }

  return mapForecastRunRowToDto(data as ForecastRunRow);
}

export async function fetchBatchSkuIds(limit: number): Promise<string[]> {
  if (limit <= 0) {
    return [];
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("sku_items")
    .select("id")
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    throw supabaseError("Failed to load SKU ids for AI batch", error.message);
  }

  return ((data ?? []) as { id: string }[]).map((row) => row.id);
}
