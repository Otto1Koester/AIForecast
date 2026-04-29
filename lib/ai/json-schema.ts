const nonNegativeNumberSchema = {
  type: "number",
  minimum: 0,
};

const nonEmptyStringSchema = {
  type: "string",
  minLength: 1,
};

const nullableNonNegativeNumberSchema = {
  type: ["number", "null"],
  minimum: 0,
};

const riskLevelSchema = {
  type: "string",
  enum: ["low", "medium", "high", "critical"],
};

export const aiForecastJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "skuId",
    "forecast",
    "reorder",
    "risks",
    "recommendations",
    "executiveSummary",
  ],
  properties: {
    skuId: nonEmptyStringSchema,
    forecast: {
      type: "object",
      additionalProperties: false,
      required: [
        "oneMonthDemand",
        "threeMonthDemand",
        "sixMonthDemand",
        "confidence",
        "trend",
        "seasonality",
        "anomalies",
      ],
      properties: {
        oneMonthDemand: nonNegativeNumberSchema,
        threeMonthDemand: nonNegativeNumberSchema,
        sixMonthDemand: nonNegativeNumberSchema,
        confidence: {
          type: "number",
          minimum: 0,
          maximum: 1,
        },
        trend: {
          type: "string",
          enum: ["declining", "stable", "growing"],
        },
        seasonality: nonEmptyStringSchema,
        anomalies: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["period", "type", "explanation"],
            properties: {
              period: nonEmptyStringSchema,
              type: {
                type: "string",
                enum: ["spike", "drop", "writeoff", "supply_gap"],
              },
              explanation: nonEmptyStringSchema,
            },
          },
        },
      },
    },
    reorder: {
      type: "object",
      additionalProperties: false,
      required: [
        "rop",
        "eoq",
        "safetyStock",
        "leadTimeDemand",
        "explanation",
      ],
      properties: {
        rop: nonNegativeNumberSchema,
        eoq: nonNegativeNumberSchema,
        safetyStock: nonNegativeNumberSchema,
        leadTimeDemand: nonNegativeNumberSchema,
        explanation: nonEmptyStringSchema,
      },
    },
    risks: {
      type: "object",
      additionalProperties: false,
      required: ["stockout", "overstock", "expiry"],
      properties: {
        stockout: {
          type: "object",
          additionalProperties: false,
          required: ["level", "daysToStockout", "explanation"],
          properties: {
            level: riskLevelSchema,
            daysToStockout: nullableNonNegativeNumberSchema,
            explanation: nonEmptyStringSchema,
          },
        },
        overstock: {
          type: "object",
          additionalProperties: false,
          required: ["level", "daysCoverage", "explanation"],
          properties: {
            level: riskLevelSchema,
            daysCoverage: nullableNonNegativeNumberSchema,
            explanation: nonEmptyStringSchema,
          },
        },
        expiry: {
          type: "object",
          additionalProperties: false,
          required: ["level", "quantityAtRisk", "explanation"],
          properties: {
            level: riskLevelSchema,
            quantityAtRisk: nonNegativeNumberSchema,
            explanation: nonEmptyStringSchema,
          },
        },
      },
    },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "action",
          "priority",
          "suggestedQuantity",
          "deadlineDays",
          "reasoning",
        ],
        properties: {
          action: {
            type: "string",
            enum: [
              "reorder",
              "accelerate_sales",
              "write_off",
              "monitor",
              "adjust_safety_stock",
            ],
          },
          priority: {
            type: "string",
            enum: ["low", "medium", "high", "urgent"],
          },
          suggestedQuantity: nonNegativeNumberSchema,
          deadlineDays: nonNegativeNumberSchema,
          reasoning: nonEmptyStringSchema,
        },
      },
    },
    executiveSummary: nonEmptyStringSchema,
  },
} as const;
