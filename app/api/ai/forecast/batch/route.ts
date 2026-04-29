import { NextResponse } from "next/server";

import { SkuNotFoundError } from "@/lib/ai/context";
import {
  generateAiForecastForSku,
  getSafeErrorMessage,
} from "@/lib/ai/forecast-service";
import { getOpenRouterModel } from "@/lib/ai/openrouter";
import { fetchBatchSkuIds } from "@/lib/ai/persistence";
import { jsonError, requireApiUser } from "@/lib/utils/api";
import type { AiBatchForecastItem } from "@/types/api";

export const runtime = "nodejs";

type BatchRequestBody = {
  skuIds?: unknown;
  force?: unknown;
};

async function readRequestBody(request: Request): Promise<BatchRequestBody> {
  try {
    const body = (await request.json()) as unknown;

    return typeof body === "object" && body !== null ? body : {};
  } catch {
    return {};
  }
}

function readBatchLimit(): number {
  const parsed = Number(process.env.AI_BATCH_LIMIT);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : 5;
}

function normalizeSkuIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(
    value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean),
  )];
}

export async function POST(request: Request) {
  try {
    const startedAt = new Date().toISOString();
    const { response } = await requireApiUser();

    if (response) {
      return response;
    }

    const body = await readRequestBody(request);
    const limit = readBatchLimit();
    const requestedSkuIds = normalizeSkuIds(body.skuIds);
    const selectedSkuIds =
      requestedSkuIds.length > 0
        ? requestedSkuIds
        : await fetchBatchSkuIds(limit);
    const skuIds = selectedSkuIds.slice(0, limit);
    const force = body.force === true;
    const items: AiBatchForecastItem[] = [];

    for (const skuId of skuIds) {
      try {
        const result = await generateAiForecastForSku(skuId, { force });

        items.push({
          skuId,
          status: "success",
          forecastId: result.forecast.id,
          runId: result.run?.id,
          cached: result.source === "cache",
        });
      } catch (error) {
        items.push({
          skuId,
          status: "error",
          errorMessage:
            error instanceof SkuNotFoundError
              ? "SKU not found"
              : getSafeErrorMessage(error),
        });
      }
    }

    const successCount = items.filter((item) => item.status === "success").length;
    const errorCount = items.filter((item) => item.status === "error").length;
    const skippedCount = items.filter((item) => item.status === "skipped").length;

    return NextResponse.json({
      startedAt,
      finishedAt: new Date().toISOString(),
      model: getOpenRouterModel(),
      totalRequested: selectedSkuIds.length,
      processed: items.length,
      succeeded: successCount,
      failed: errorCount,
      successCount,
      errorCount,
      skippedCount,
      items,
    });
  } catch (error) {
    console.error("POST /api/ai/forecast/batch failed", getSafeErrorMessage(error));
    return jsonError(getSafeErrorMessage(error), 500);
  }
}
