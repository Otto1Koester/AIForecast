import type { ChatCompletion } from "openai/resources/chat/completions";

import {
  buildAiForecastContext,
  buildAiInputHash,
  type AiForecastContext,
} from "@/lib/ai/context";
import { aiForecastJsonSchema } from "@/lib/ai/json-schema";
import { createOpenRouterClient, getOpenRouterModel } from "@/lib/ai/openrouter";
import {
  getLatestForecastForSku,
  getLatestRunForSku,
  insertForecast,
  insertForecastRun,
  updateForecastRun,
} from "@/lib/ai/persistence";
import { buildAiForecastMessages } from "@/lib/ai/prompt";
import { validateAiForecastAnalysis } from "@/lib/ai/schema";
import type {
  AiForecastAnalysis,
  AiForecastRecord,
  AiForecastRun,
} from "@/types/ai";

export type AiForecastSource = "cache" | "openrouter";

export type GenerateAiForecastResult = {
  source: AiForecastSource;
  forecast: AiForecastRecord;
  run: AiForecastRun | null;
  model: string;
  inputHash: string;
  analysis: AiForecastAnalysis;
};

type GenerateAiForecastOptions = {
  force?: boolean;
};

type OpenRouterForecastResult = {
  analysis: AiForecastAnalysis;
  rawResponse: unknown;
};

function toJsonSafe(value: unknown): unknown {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return null;
  }
}

function extractMessagePayload(completion: ChatCompletion): unknown {
  const message = completion.choices[0]?.message as
    | {
        content?: unknown;
        parsed?: unknown;
      }
    | undefined;

  if (!message) {
    throw new Error("OpenRouter response did not contain a message.");
  }

  if (message.parsed !== undefined) {
    return message.parsed;
  }

  if (Array.isArray(message.content)) {
    const text = message.content
      .map((part) =>
        typeof part === "object" &&
        part !== null &&
        "text" in part &&
        typeof part.text === "string"
          ? part.text
          : "",
      )
      .join("");

    return text || message.content;
  }

  if (message.content === null || message.content === undefined) {
    throw new Error("OpenRouter response content was empty.");
  }

  return message.content;
}

function assertForecastGuardrails(
  requestedSkuId: string,
  analysis: AiForecastAnalysis,
) {
  if (analysis.skuId !== requestedSkuId) {
    throw new Error(
      `OpenRouter forecast SKU mismatch: expected ${requestedSkuId}, received ${analysis.skuId}.`,
    );
  }

  const values = [
    analysis.forecast.oneMonthDemand,
    analysis.forecast.threeMonthDemand,
    analysis.forecast.sixMonthDemand,
    analysis.reorder.rop,
    analysis.reorder.eoq,
    analysis.forecast.confidence,
  ];

  if (values.some((value) => !Number.isFinite(value))) {
    throw new Error("OpenRouter forecast contains non-finite numeric values.");
  }

  if (
    analysis.forecast.confidence < 0 ||
    analysis.forecast.confidence > 1
  ) {
    throw new Error("OpenRouter forecast confidence is outside the 0..1 range.");
  }
}

async function requestOpenRouterForecast(
  skuId: string,
  model: string,
  context: AiForecastContext,
): Promise<OpenRouterForecastResult> {
  const client = createOpenRouterClient();
  const messages = buildAiForecastMessages(context);
  let lastValidationError: unknown = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const completion = await client.chat.completions.create({
      model,
      messages,
      temperature: 0.2,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "ai_forecast_analysis",
          strict: true,
          schema: aiForecastJsonSchema,
        },
      },
    });

    try {
      const analysis = validateAiForecastAnalysis(
        extractMessagePayload(completion),
      );
      assertForecastGuardrails(skuId, analysis);

      return {
        analysis,
        rawResponse: toJsonSafe(completion),
      };
    } catch (error) {
      lastValidationError = error;

      if (attempt === 1) {
        break;
      }
    }
  }

  throw new Error(
    `OpenRouter returned invalid forecast JSON: ${getSafeErrorMessage(lastValidationError)}`,
  );
}

export function getSafeErrorMessage(error: unknown): string {
  const fallback = "Unknown AI forecast generation error.";
  const apiKey = process.env.OPENROUTER_API_KEY;
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : fallback;

  return (apiKey ? message.replaceAll(apiKey, "[redacted]") : message).slice(
    0,
    1000,
  );
}

export async function generateAiForecastForSku(
  skuId: string,
  options: GenerateAiForecastOptions = {},
): Promise<GenerateAiForecastResult> {
  const context = await buildAiForecastContext(skuId);
  const inputHash = buildAiInputHash(context);
  const latestForecast = await getLatestForecastForSku(skuId);

  if (latestForecast?.inputHash === inputHash && options.force !== true) {
    const latestRun = await getLatestRunForSku(skuId);

    return {
      source: "cache",
      forecast: latestForecast,
      run: latestRun,
      model: latestForecast.model,
      inputHash,
      analysis: latestForecast.analysis,
    };
  }

  const model = getOpenRouterModel();
  let run: AiForecastRun | null = null;

  try {
    run = await insertForecastRun({
      skuId,
      model,
      inputHash,
    });

    const { analysis, rawResponse } = await requestOpenRouterForecast(
      skuId,
      model,
      context,
    );
    const forecast = await insertForecast({
      skuId,
      model,
      inputHash,
      analysis,
      rawResponse,
    });
    const finishedRun = await updateForecastRun(run.id, {
      status: "success",
      errorMessage: null,
      finishedAt: new Date().toISOString(),
    });

    return {
      source: "openrouter",
      forecast,
      run: finishedRun,
      model,
      inputHash,
      analysis,
    };
  } catch (error) {
    if (run) {
      await updateForecastRun(run.id, {
        status: "error",
        errorMessage: getSafeErrorMessage(error),
        finishedAt: new Date().toISOString(),
      });
    }

    throw error;
  }
}
