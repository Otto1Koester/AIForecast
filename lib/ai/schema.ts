import { z } from "zod";

import { normalizeAiForecastAnalysis } from "@/lib/ai/monthly-forecast";
import type { AiForecastAnalysis } from "@/types/ai";

const riskLevelSchema = z.enum(["low", "medium", "high", "critical"]);

const nonNegativeNumberSchema = z.number().finite().min(0);
const optionalNonNegativeNumberSchema = z.preprocess(
  (value) => (value === null ? undefined : value),
  nonNegativeNumberSchema.optional(),
);
const monthOffsetSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
]);
const monthlyForecastSchema = z
  .array(
    z
      .object({
        monthOffset: monthOffsetSchema,
        period: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
        demand: nonNegativeNumberSchema,
        explanation: z.string().min(1).optional(),
      })
      .strict(),
  )
  .length(6)
  .superRefine((points, ctx) => {
    const offsets = new Set(points.map((point) => point.monthOffset));

    if (offsets.size !== points.length) {
      ctx.addIssue({
        code: "custom",
        message: "monthlyForecast monthOffset values must be unique.",
      });
    }
  });

export const aiForecastAnalysisSchema = z
  .object({
    skuId: z.string().min(1),
    forecast: z
      .object({
        oneMonthDemand: nonNegativeNumberSchema,
        threeMonthDemand: nonNegativeNumberSchema,
        sixMonthDemand: nonNegativeNumberSchema,
        monthlyForecast: monthlyForecastSchema,
        confidence: z.number().finite().min(0).max(1),
        trend: z.enum(["declining", "stable", "growing"]),
        seasonality: z.string().min(1),
        anomalies: z.array(
          z
            .object({
              period: z.string().min(1),
              type: z.enum(["spike", "drop", "writeoff", "supply_gap"]),
              explanation: z.string().min(1),
            })
            .strict(),
        ),
      })
      .strict(),
    reorder: z
      .object({
        rop: nonNegativeNumberSchema,
        eoq: nonNegativeNumberSchema,
        safetyStock: nonNegativeNumberSchema,
        leadTimeDemand: nonNegativeNumberSchema,
        recommendedOrderQuantity: nonNegativeNumberSchema,
        explanation: z.string().min(1),
      })
      .strict(),
    risks: z
      .object({
        stockout: z
          .object({
            level: riskLevelSchema,
            daysToStockout: nonNegativeNumberSchema.nullable(),
            explanation: z.string().min(1),
          })
          .strict(),
        overstock: z
          .object({
            level: riskLevelSchema,
            daysCoverage: nonNegativeNumberSchema.nullable(),
            explanation: z.string().min(1),
          })
          .strict(),
        expiry: z
          .object({
            level: riskLevelSchema,
            quantityAtRisk: nonNegativeNumberSchema,
            explanation: z.string().min(1),
          })
          .strict(),
      })
      .strict(),
    recommendations: z.array(
      z
        .object({
          action: z.enum([
            "reorder",
            "accelerate_sales",
            "write_off",
            "monitor",
            "adjust_safety_stock",
          ]),
          priority: z.enum(["low", "medium", "high", "urgent"]),
          suggestedQuantity: optionalNonNegativeNumberSchema,
          deadlineDays: optionalNonNegativeNumberSchema,
          reasoning: z.string().min(1),
        })
        .strict()
        .superRefine((recommendation, ctx) => {
          if (
            recommendation.action === "reorder" &&
            recommendation.suggestedQuantity === undefined
          ) {
            ctx.addIssue({
              code: "custom",
              path: ["suggestedQuantity"],
              message:
                "reorder recommendations must include suggestedQuantity.",
            });
          }
        }),
    ),
    executiveSummary: z.string().min(1),
  })
  .strict();

function parseJsonString(value: string): unknown {
  const trimmed = value.trim();
  const withoutFence = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");

  return JSON.parse(withoutFence);
}

export function validateAiForecastAnalysis(
  value: unknown,
  options: { leadTimeDays?: number } = {},
): AiForecastAnalysis {
  const candidate = typeof value === "string" ? parseJsonString(value) : value;

  return normalizeAiForecastAnalysis(aiForecastAnalysisSchema.parse(candidate), {
    leadTimeDays: options.leadTimeDays,
  });
}
