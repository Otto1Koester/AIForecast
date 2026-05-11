import type {
  AiForecastAnalysis,
  AiForecastMonthOffset,
  AiMonthlyForecastPoint,
  AiRiskLevel,
} from "@/types/ai";

export const AI_FORECAST_MONTH_OFFSETS = [1, 2, 3, 4, 5, 6] as const;

const PERIOD_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

type RiskGuardrailOptions = {
  leadTimeDays?: number;
};

type MonthlyForecastOptions = {
  fallbackReferencePeriod?: string | Date | null;
};

function roundForecastValue(value: number, digits = 2): number {
  const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0;
  const multiplier = 10 ** digits;

  return Math.round((safeValue + Number.EPSILON) * multiplier) / multiplier;
}

function toNumberOrNull(value: unknown): number | null {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : null;

  return parsed !== null && Number.isFinite(parsed) ? parsed : null;
}

function toUtcMonthStart(value: string | Date | null | undefined): Date {
  const parsed =
    value instanceof Date
      ? value
      : typeof value === "string"
        ? new Date(value)
        : new Date();

  if (Number.isNaN(parsed.getTime())) {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  }

  return new Date(
    Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), 1),
  );
}

function addMonths(date: Date, months: number): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1),
  );
}

function toPeriod(value: Date): string {
  const month = String(value.getUTCMonth() + 1).padStart(2, "0");
  return `${value.getUTCFullYear()}-${month}`;
}

function fallbackPeriod(
  monthOffset: AiForecastMonthOffset,
  referencePeriod?: string | Date | null,
): string {
  return toPeriod(addMonths(toUtcMonthStart(referencePeriod), monthOffset));
}

function isForecastMonthOffset(value: number): value is AiForecastMonthOffset {
  return (AI_FORECAST_MONTH_OFFSETS as readonly number[]).includes(value);
}

export function isValidMonthlyForecast(
  value: unknown,
): value is AiMonthlyForecastPoint[] {
  return normalizeMonthlyForecast(value) !== null;
}

export function normalizeMonthlyForecast(
  value: unknown,
): AiMonthlyForecastPoint[] | null {
  if (!Array.isArray(value) || value.length !== AI_FORECAST_MONTH_OFFSETS.length) {
    return null;
  }

  const seen = new Set<number>();
  const points: AiMonthlyForecastPoint[] = [];

  for (const item of value) {
    if (typeof item !== "object" || item === null || Array.isArray(item)) {
      return null;
    }

    const candidate = item as Record<string, unknown>;
    const monthOffset = toNumberOrNull(candidate.monthOffset);
    const demand = toNumberOrNull(candidate.demand);
    const period = candidate.period;
    const explanation = candidate.explanation;

    if (
      monthOffset === null ||
      !Number.isInteger(monthOffset) ||
      !isForecastMonthOffset(monthOffset) ||
      seen.has(monthOffset) ||
      demand === null ||
      demand < 0 ||
      typeof period !== "string" ||
      !PERIOD_PATTERN.test(period) ||
      (explanation !== undefined && typeof explanation !== "string")
    ) {
      return null;
    }

    seen.add(monthOffset);
    points.push({
      monthOffset,
      period,
      demand: roundForecastValue(demand),
      ...(typeof explanation === "string" && explanation.trim()
        ? { explanation: explanation.trim() }
        : {}),
    });
  }

  if (seen.size !== AI_FORECAST_MONTH_OFFSETS.length) {
    return null;
  }

  return points.sort((left, right) => left.monthOffset - right.monthOffset);
}

function buildFallbackMonthlyForecast(
  analysis: AiForecastAnalysis,
  referencePeriod?: string | Date | null,
): AiMonthlyForecastPoint[] {
  const oneMonthDemand = roundForecastValue(analysis.forecast.oneMonthDemand);
  const threeMonthDemand = roundForecastValue(analysis.forecast.threeMonthDemand);
  const sixMonthDemand = roundForecastValue(analysis.forecast.sixMonthDemand);
  const secondAndThirdMonthDemand = roundForecastValue(
    Math.max(0, threeMonthDemand - oneMonthDemand) / 2,
  );
  const fourthToSixthMonthDemand = roundForecastValue(
    Math.max(0, sixMonthDemand - threeMonthDemand) / 3,
  );

  return AI_FORECAST_MONTH_OFFSETS.map((monthOffset) => {
    const demand =
      monthOffset === 1
        ? oneMonthDemand
        : monthOffset <= 3
          ? secondAndThirdMonthDemand
          : fourthToSixthMonthDemand;

    return {
      monthOffset,
      period: fallbackPeriod(monthOffset, referencePeriod),
      demand,
      explanation:
        "Совместимость со старой записью: месячная точка восстановлена из суммарного AI-прогноза.",
    };
  });
}

function sumDemand(
  points: AiMonthlyForecastPoint[],
  horizon: AiForecastMonthOffset,
): number {
  return roundForecastValue(
    points
      .filter((point) => point.monthOffset <= horizon)
      .reduce((total, point) => total + point.demand, 0),
  );
}

function maxRiskLevel(left: AiRiskLevel, right: AiRiskLevel): AiRiskLevel {
  const order: AiRiskLevel[] = ["low", "medium", "high", "critical"];

  return order.indexOf(left) >= order.indexOf(right) ? left : right;
}

function withRiskGuardrails(
  analysis: AiForecastAnalysis,
  options: RiskGuardrailOptions = {},
): AiForecastAnalysis {
  const averageDailyDemand = analysis.forecast.oneMonthDemand / 30;
  const safetyDays =
    averageDailyDemand > 0
      ? analysis.reorder.safetyStock / averageDailyDemand
      : 0;
  const daysToStockout = analysis.risks.stockout.daysToStockout;
  const daysCoverage = analysis.risks.overstock.daysCoverage;
  const leadTimeDays = options.leadTimeDays;
  let stockoutLevel = analysis.risks.stockout.level;
  let stockoutExplanation = analysis.risks.stockout.explanation;
  let overstockLevel = analysis.risks.overstock.level;
  let overstockExplanation = analysis.risks.overstock.explanation;

  if (
    typeof leadTimeDays === "number" &&
    Number.isFinite(leadTimeDays) &&
    leadTimeDays > 0 &&
    daysToStockout !== null
  ) {
    if (daysToStockout <= leadTimeDays) {
      stockoutLevel = "critical";
      stockoutExplanation =
        "Критический риск дефицита: запас может закончиться раньше или около срока поставки.";
    } else if (daysToStockout <= leadTimeDays + safetyDays) {
      stockoutLevel = maxRiskLevel(stockoutLevel, "high");
    }
  }

  const urgentReorder = analysis.recommendations.some(
    (recommendation) =>
      recommendation.action === "reorder" &&
      (recommendation.priority === "high" ||
        recommendation.priority === "urgent") &&
      (recommendation.suggestedQuantity ?? 0) > 0,
  );

  if (urgentReorder) {
    stockoutLevel = maxRiskLevel(stockoutLevel, "high");
  }

  if (daysCoverage !== null && daysCoverage < 30) {
    overstockLevel = "low";
    overstockExplanation =
      "Риск затоваривания низкий: покрытие меньше 30 дней и не указывает на избыток.";
  }

  return {
    ...analysis,
    risks: {
      ...analysis.risks,
      stockout: {
        ...analysis.risks.stockout,
        level: stockoutLevel,
        explanation: stockoutExplanation,
      },
      overstock: {
        ...analysis.risks.overstock,
        level: overstockLevel,
        explanation: overstockExplanation,
      },
    },
  };
}

export function normalizeAiForecastAnalysis(
  analysis: AiForecastAnalysis,
  options: MonthlyForecastOptions & RiskGuardrailOptions = {},
): AiForecastAnalysis {
  const monthlyForecast =
    normalizeMonthlyForecast(
      (analysis.forecast as AiForecastAnalysis["forecast"] & {
        monthlyForecast?: unknown;
      }).monthlyForecast,
    ) ?? buildFallbackMonthlyForecast(analysis, options.fallbackReferencePeriod);
  const normalizedAnalysis = {
    ...analysis,
    forecast: {
      ...analysis.forecast,
      monthlyForecast,
      oneMonthDemand: sumDemand(monthlyForecast, 1),
      threeMonthDemand: sumDemand(monthlyForecast, 3),
      sixMonthDemand: sumDemand(monthlyForecast, 6),
    },
  };

  return withRiskGuardrails(normalizedAnalysis, options);
}

export function getMonthlyForecastPoints(
  analysis: AiForecastAnalysis,
  options: MonthlyForecastOptions = {},
): AiMonthlyForecastPoint[] {
  const monthlyForecast = normalizeMonthlyForecast(
    (analysis.forecast as AiForecastAnalysis["forecast"] & {
      monthlyForecast?: unknown;
    }).monthlyForecast,
  );

  return monthlyForecast ?? buildFallbackMonthlyForecast(
    analysis,
    options.fallbackReferencePeriod,
  );
}
