import { NextResponse } from "next/server";

import { SkuNotFoundError } from "@/lib/ai/context";
import {
  generateAiForecastForSku,
  getSafeErrorMessage,
} from "@/lib/ai/forecast-service";
import { jsonError, requireApiUser } from "@/lib/utils/api";

export const runtime = "nodejs";

type ForecastRequestBody = {
  force?: unknown;
};

async function readRequestBody(request: Request): Promise<ForecastRequestBody> {
  try {
    const body = (await request.json()) as unknown;

    return typeof body === "object" && body !== null ? body : {};
  } catch {
    return {};
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ skuId: string }> },
) {
  try {
    const { response } = await requireApiUser();

    if (response) {
      return response;
    }

    const { skuId } = await params;
    const body = await readRequestBody(request);
    const result = await generateAiForecastForSku(skuId, {
      force: body.force === true,
    });

    return NextResponse.json({
      skuId,
      forecastId: result.forecast.id,
      runId: result.run?.id ?? "",
      status: "success",
      cached: result.source === "cache",
      source: result.source,
      model: result.model,
      inputHash: result.inputHash,
      createdAt: result.forecast.createdAt,
      forecast: {
        forecastId: result.forecast.id,
        model: result.forecast.model,
        createdAt: result.forecast.createdAt,
        confidence: result.forecast.confidence,
        forecast1m: result.forecast.forecast1m,
        forecast3m: result.forecast.forecast3m,
        forecast6m: result.forecast.forecast6m,
        trend: result.analysis.forecast.trend,
      },
      analysis: result.analysis,
    });
  } catch (error) {
    if (error instanceof SkuNotFoundError) {
      return jsonError("SKU not found", 404);
    }

    console.error("POST /api/ai/forecast/[skuId] failed", getSafeErrorMessage(error));
    return jsonError(getSafeErrorMessage(error), 500);
  }
}
