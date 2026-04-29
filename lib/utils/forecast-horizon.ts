export type ForecastHorizon = 1 | 3 | 6;

export const FORECAST_HORIZONS: readonly ForecastHorizon[] = [1, 3, 6];

const HORIZON_POINT_COUNT: Record<ForecastHorizon, number> = {
  1: 1,
  3: 2,
  6: 3,
};

export const HORIZON_OPTION_LABELS: Record<ForecastHorizon, string> = {
  1: "1 месяц",
  3: "3 месяца",
  6: "6 месяцев",
};

export const HORIZON_FORECAST_TITLES: Record<ForecastHorizon, string> = {
  1: "Прогноз на 1 месяц",
  3: "Прогноз на 3 месяца",
  6: "Прогноз на 6 месяцев",
};

export const DEFAULT_FORECAST_HORIZON: ForecastHorizon = 3;

type ForecastVsFactPoint = {
  period: string;
  forecast: number | null;
  fact: number | null;
};

/**
 * Build chart-ready forecast/fact points for a chosen horizon.
 *
 * The DTO ships three trailing forecast points (+1m, +3m, +6m) after the last
 * fact period. For the chart we keep:
 *   horizon = 1 → forecast_1m;
 *   horizon = 3 → forecast_1m + forecast_3m;
 *   horizon = 6 → forecast_1m + forecast_3m + forecast_6m.
 *
 * To make the dashed AI-прогноз line visually start from history, we anchor
 * it at the most recent fact point by setting `forecast = fact` on that
 * single point. This is a graphical anchor (the actually observed value),
 * not a forecast value — real forecasts come from forecast_1m/3m/6m and are
 * left untouched.
 */
export function buildChartPointsForHorizon<T extends ForecastVsFactPoint>(
  points: T[],
  horizon: ForecastHorizon,
): T[] {
  const sorted = [...points].sort((a, b) => a.period.localeCompare(b.period));
  const forecastOnlyPoints = sorted.filter(
    (point) => point.fact === null && point.forecast !== null,
  );
  const factPoints = sorted.filter(
    (point) => !(point.fact === null && point.forecast !== null),
  );

  const selectedForecastPoints = forecastOnlyPoints.slice(
    0,
    HORIZON_POINT_COUNT[horizon],
  );

  if (selectedForecastPoints.length === 0) {
    return factPoints;
  }

  let lastFactIndex = -1;
  for (let i = factPoints.length - 1; i >= 0; i -= 1) {
    if (factPoints[i].fact !== null) {
      lastFactIndex = i;
      break;
    }
  }

  const factWithBridge =
    lastFactIndex === -1
      ? factPoints
      : factPoints.map((point, index) =>
          index === lastFactIndex
            ? ({ ...point, forecast: point.fact } as T)
            : point,
        );

  return [...factWithBridge, ...selectedForecastPoints];
}

export function hasAnyForecastPoint<T extends ForecastVsFactPoint>(
  points: T[],
): boolean {
  return points.some(
    (point) => point.fact === null && point.forecast !== null,
  );
}
