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

import type { DashboardForecastVsFactPoint } from "@/types/api";

const monthFormatter = new Intl.DateTimeFormat("ru-RU", {
  month: "short",
  year: "2-digit",
});

const numberFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 0,
});

function formatPeriod(period: string): string {
  const date = new Date(period);
  return Number.isNaN(date.getTime()) ? period : monthFormatter.format(date);
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? numberFormatter.format(n) : "—";
}

export type ForecastVsFactChartProps = {
  points: DashboardForecastVsFactPoint[];
};

export function ForecastVsFactChart({ points }: ForecastVsFactChartProps) {
  const data = [...points]
    .sort((a, b) => a.period.localeCompare(b.period))
    .map((p) => ({ ...p, period: formatPeriod(p.period) }));

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
            formatValue(value),
            String(name ?? ""),
          ]}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="fact"
          name="Факт"
          stroke="#0ea5e9"
          strokeWidth={2}
          dot={{ r: 3 }}
          connectNulls
        />
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
      </LineChart>
    </ResponsiveContainer>
  );
}
