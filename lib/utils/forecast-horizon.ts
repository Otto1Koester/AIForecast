export type ForecastHorizon = 1 | 3 | 6;

export const FORECAST_HORIZONS: readonly ForecastHorizon[] = [1, 3, 6];

const HORIZON_INDEX: Record<ForecastHorizon, number> = {
  1: 0,
  3: 1,
  6: 2,
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
 * The DTO ships every forecast horizon as a separate trailing point
 * (+1m, +3m, +6m after the last fact). For a chosen horizon we keep all
 * historical fact points and only the matching forecast point — so the
 * chart "AI-прогноз" series visibly aligns with the selected horizon.
 */
export function filterForecastPointsByHorizon<T extends ForecastVsFactPoint>(
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
  const selected = forecastOnlyPoints[HORIZON_INDEX[horizon]];
  if (!selected) {
    return factPoints;
  }
  return [...factPoints, selected];
}

export function hasForecastForHorizon<T extends ForecastVsFactPoint>(
  points: T[],
  horizon: ForecastHorizon,
): boolean {
  const forecastOnlyPoints = points.filter(
    (point) => point.fact === null && point.forecast !== null,
  );
  return forecastOnlyPoints[HORIZON_INDEX[horizon]] !== undefined;
}
