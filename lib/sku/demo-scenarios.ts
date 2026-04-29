import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { toNumber } from "@/lib/sku/mappers";
import type { NumericValue } from "@/lib/sku/types";
import type {
  DemoScenario,
  DemoScenarioChangedMovement,
  DemoScenarioResponse,
} from "@/types/api";

type DemoScenarioAction = Exclude<DemoScenario, "reset">;

type SkuStockRow = {
  id: string;
  current_stock: NumericValue;
};

type InventoryMovementPatchRow = {
  id: string;
  outbound_qty: NumericValue;
  ending_stock: NumericValue;
};

type DemoScenarioBaselineRow = {
  sku_id: string;
  original_current_stock: NumericValue;
  original_movements: unknown;
  active_scenario: string | null;
};

type MovementSnapshot = {
  id: string;
  outbound_qty: number;
  ending_stock: number;
};

export class DemoScenarioError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

function toNonnegativeNumber(value: NumericValue | null | undefined): number {
  return Math.max(0, toNumber(value));
}

function toScenarioStock(
  scenario: DemoScenarioAction,
  originalCurrentStock: number,
): number {
  if (scenario === "stockout") {
    return Math.max(1, Math.round(originalCurrentStock * 0.07));
  }

  return Math.max(1, Math.round(originalCurrentStock * 4));
}

function parseMovementSnapshots(value: unknown): MovementSnapshot[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (typeof item !== "object" || item === null) {
      return [];
    }

    const candidate = item as Record<string, unknown>;
    if (typeof candidate.id !== "string") {
      return [];
    }

    return [
      {
        id: candidate.id,
        outbound_qty: toNonnegativeNumber(
          candidate.outbound_qty as NumericValue | null | undefined,
        ),
        ending_stock: toNonnegativeNumber(
          candidate.ending_stock as NumericValue | null | undefined,
        ),
      },
    ];
  });
}

function buildMovementSnapshots(
  rows: InventoryMovementPatchRow[],
): MovementSnapshot[] {
  return rows.map((row) => ({
    id: row.id,
    outbound_qty: toNonnegativeNumber(row.outbound_qty),
    ending_stock: toNonnegativeNumber(row.ending_stock),
  }));
}

function buildScenarioMovementChanges(
  scenario: DemoScenarioAction,
  originalMovements: MovementSnapshot[],
  originalCurrentStock: number,
  nextCurrentStock: number,
): MovementSnapshot[] {
  return originalMovements.map((movement, index) => {
    if (scenario === "stockout") {
      const endingStock = Math.max(
        0,
        Math.round(nextCurrentStock + originalCurrentStock * 0.05 * index),
      );

      return {
        id: movement.id,
        outbound_qty: Math.round(movement.outbound_qty * 1.45),
        ending_stock: endingStock,
      };
    }

    const endingStock = Math.max(
      0,
      Math.round(nextCurrentStock - originalCurrentStock * 0.15 * index),
    );

    return {
      id: movement.id,
      outbound_qty: Math.round(movement.outbound_qty * 0.4),
      ending_stock: endingStock,
    };
  });
}

async function fetchSkuStock(skuId: string): Promise<SkuStockRow | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("sku_items")
    .select("id, current_stock")
    .eq("id", skuId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load SKU stock: ${error.message}`);
  }

  return (data as SkuStockRow | null) ?? null;
}

async function fetchLatestMovementRows(
  skuId: string,
): Promise<InventoryMovementPatchRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("inventory_movements")
    .select("id, outbound_qty, ending_stock")
    .eq("sku_id", skuId)
    .order("period_month", { ascending: false })
    .limit(3);

  if (error) {
    throw new Error(`Failed to load latest inventory movements: ${error.message}`);
  }

  return ((data ?? []) as InventoryMovementPatchRow[]).map((row) => ({
    id: row.id,
    outbound_qty: toNonnegativeNumber(row.outbound_qty),
    ending_stock: toNonnegativeNumber(row.ending_stock),
  }));
}

async function fetchBaseline(
  skuId: string,
): Promise<DemoScenarioBaselineRow | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("demo_scenario_baselines")
    .select("sku_id, original_current_stock, original_movements, active_scenario")
    .eq("sku_id", skuId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load demo scenario baseline: ${error.message}`);
  }

  return (data as DemoScenarioBaselineRow | null) ?? null;
}

async function createBaseline(
  sku: SkuStockRow,
): Promise<DemoScenarioBaselineRow> {
  const supabase = createSupabaseAdminClient();
  const latestMovements = await fetchLatestMovementRows(sku.id);
  const originalMovements = buildMovementSnapshots(latestMovements);

  const { data, error } = await supabase
    .from("demo_scenario_baselines")
    .insert({
      sku_id: sku.id,
      original_current_stock: toNonnegativeNumber(sku.current_stock),
      original_movements: originalMovements,
      active_scenario: null,
    })
    .select("sku_id, original_current_stock, original_movements, active_scenario")
    .single();

  if (error) {
    if (error.code === "23505") {
      const baseline = await fetchBaseline(sku.id);
      if (baseline) {
        return baseline;
      }
    }

    throw new Error(`Failed to create demo scenario baseline: ${error.message}`);
  }

  return data as DemoScenarioBaselineRow;
}

async function ensureBaseline(sku: SkuStockRow): Promise<DemoScenarioBaselineRow> {
  const existing = await fetchBaseline(sku.id);
  return existing ?? createBaseline(sku);
}

async function updateSkuStock(
  skuId: string,
  currentStock: number,
): Promise<number> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("sku_items")
    .update({ current_stock: currentStock })
    .eq("id", skuId)
    .select("current_stock")
    .single();

  if (error) {
    throw new Error(`Failed to update SKU stock: ${error.message}`);
  }

  return toNonnegativeNumber(
    (data as { current_stock: NumericValue }).current_stock,
  );
}

async function updateBaselineScenario(
  skuId: string,
  activeScenario: DemoScenarioAction | null,
): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("demo_scenario_baselines")
    .update({
      active_scenario: activeScenario,
      updated_at: new Date().toISOString(),
    })
    .eq("sku_id", skuId);

  if (error) {
    throw new Error(`Failed to update demo scenario baseline: ${error.message}`);
  }
}

async function updateMovementRows(
  skuId: string,
  changes: MovementSnapshot[],
): Promise<DemoScenarioChangedMovement[]> {
  const supabase = createSupabaseAdminClient();
  const updated: DemoScenarioChangedMovement[] = [];

  for (const change of changes) {
    const { data, error } = await supabase
      .from("inventory_movements")
      .update({
        outbound_qty: change.outbound_qty,
        ending_stock: change.ending_stock,
      })
      .eq("id", change.id)
      .eq("sku_id", skuId)
      .select("id, outbound_qty, ending_stock")
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to update inventory movement: ${error.message}`);
    }

    if (data) {
      const row = data as InventoryMovementPatchRow;
      updated.push({
        id: row.id,
        outboundQty: toNonnegativeNumber(row.outbound_qty),
        endingStock: toNonnegativeNumber(row.ending_stock),
      });
    }
  }

  return updated;
}

function getScenarioMessage(scenario: DemoScenario): string {
  if (scenario === "stockout") {
    return "Сценарий дефицита применён. Нажмите «Пересчитать AI-прогноз».";
  }

  if (scenario === "overstock") {
    return "Сценарий избытка применён. Нажмите «Пересчитать AI-прогноз».";
  }

  return "Демо-сценарий сброшен. Нажмите «Пересчитать AI-прогноз», если хотите обновить AI-анализ.";
}

async function applyScenario(
  sku: SkuStockRow,
  scenario: DemoScenarioAction,
): Promise<DemoScenarioResponse> {
  const baseline = await ensureBaseline(sku);
  const originalCurrentStock = toNonnegativeNumber(
    baseline.original_current_stock,
  );
  const originalMovements = parseMovementSnapshots(baseline.original_movements);
  const nextCurrentStock = toScenarioStock(scenario, originalCurrentStock);
  const movementChanges = buildScenarioMovementChanges(
    scenario,
    originalMovements,
    originalCurrentStock,
    nextCurrentStock,
  );

  const [currentStock, changedMovements] = await Promise.all([
    updateSkuStock(sku.id, nextCurrentStock),
    updateMovementRows(sku.id, movementChanges),
  ]);
  await updateBaselineScenario(sku.id, scenario);

  return {
    scenario,
    message: getScenarioMessage(scenario),
    sku: {
      id: sku.id,
      currentStock,
    },
    changedMovements,
  };
}

async function resetScenario(sku: SkuStockRow): Promise<DemoScenarioResponse> {
  const baseline = await fetchBaseline(sku.id);

  if (!baseline) {
    throw new DemoScenarioError(
      "Для этого SKU нет сохранённого демо-сценария для сброса.",
      409,
    );
  }

  const originalCurrentStock = toNonnegativeNumber(
    baseline.original_current_stock,
  );
  const originalMovements = parseMovementSnapshots(baseline.original_movements);
  const [currentStock, changedMovements] = await Promise.all([
    updateSkuStock(sku.id, originalCurrentStock),
    updateMovementRows(sku.id, originalMovements),
  ]);
  await updateBaselineScenario(sku.id, null);

  return {
    scenario: "reset",
    message: getScenarioMessage("reset"),
    sku: {
      id: sku.id,
      currentStock,
    },
    changedMovements,
  };
}

export async function applySkuDemoScenario(
  skuId: string,
  scenario: DemoScenario,
): Promise<DemoScenarioResponse> {
  const sku = await fetchSkuStock(skuId);

  if (!sku) {
    throw new DemoScenarioError("SKU not found", 404);
  }

  if (scenario === "reset") {
    return resetScenario(sku);
  }

  return applyScenario(sku, scenario);
}
