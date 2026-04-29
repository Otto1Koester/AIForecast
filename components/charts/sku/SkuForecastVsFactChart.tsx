"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatUnitRu } from "@/lib/utils/format";
import type { SkuForecastVsFactPoint } from "@/types/api";

const monthFormatter = new Intl.DateTimeFormat("ru-RU", {
  month: "short",
  year: "2-digit",
});

const numberFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 0,
});

function formatNumber(value: unknown): string {
  if (value === null || value === undefined) return "—";
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) ? numberFormatter.format(numeric) : "—";
}

function formatPeriod(period: string): string {
  const date = new Date(period);
  if (Number.isNaN(date.getTime())) return period;
  return monthFormatter.format(date);
}

export type SkuForecastVsFactChartProps = {
  points: SkuForecastVsFactPoint[];
  unit: string;
  hasForecast: boolean;
};

export function SkuForecastVsFactChart({
  points,
  unit,
  hasForecast,
}: SkuForecastVsFactChartProps) {
  const data = [...points]
    .sort((a, b) => a.period.localeCompare(b.period))
    .map((p) => ({
      period: formatPeriod(p.period),
      fact: p.fact,
      forecast: p.forecast,
    }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
        <XAxis dataKey="period" stroke="#71717a" fontSize={12} />
        <YAxis stroke="#71717a" fontSize={12} />
        <Tooltip
          contentStyle={{ borderRadius: 8, fontSize: 12 }}
          formatter={(value: unknown, name: unknown) => [
            `${formatNumber(value)} ${formatUnitRu(unit)}`,
            String(name ?? ""),
          ]}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="fact"
          name="Факт (расход)"
          stroke="#0ea5e9"
          strokeWidth={2}
          dot={{ r: 3 }}
          connectNulls
        />
        {hasForecast ? (
          <Line
            type="monotone"
            dataKey="forecast"
            name="AI-прогноз"
            stroke="#8b5cf6"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={{ r: 3 }}
            connectNulls
          />
        ) : null}
      </LineChart>
    </ResponsiveContainer>
  );
}
