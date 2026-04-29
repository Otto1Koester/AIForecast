"use client";

import type { ReactNode } from "react";

import {
  FORECAST_HORIZONS,
  HORIZON_OPTION_LABELS,
  type ForecastHorizon,
} from "@/lib/utils/forecast-horizon";

export type ForecastHorizonSelectorProps = {
  value: ForecastHorizon;
  onChange: (next: ForecastHorizon) => void;
  label?: string;
  ariaLabel?: string;
};

export function ForecastHorizonSelector({
  value,
  onChange,
  label = "Горизонт",
  ariaLabel = "Горизонт прогноза",
}: ForecastHorizonSelectorProps): ReactNode {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex flex-wrap items-center rounded-lg border border-zinc-200 bg-zinc-50 p-1 text-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      {label ? (
        <span className="px-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {label}
        </span>
      ) : null}
      {FORECAST_HORIZONS.map((option) => {
        const isActive = option === value;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option)}
            className={
              isActive
                ? "rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors dark:bg-zinc-100 dark:text-zinc-900"
                : "rounded-md px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            }
          >
            {HORIZON_OPTION_LABELS[option]}
          </button>
        );
      })}
    </div>
  );
}
