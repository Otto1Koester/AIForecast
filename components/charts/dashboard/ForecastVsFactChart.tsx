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

export type ForecastVsFactChartProps = {
  points: DashboardForecastVsFactPoint[];
};

export function ForecastVsFactChart({ points }: ForecastVsFactChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={points}
        margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
        <XAxis dataKey="period" stroke="#71717a" fontSize={12} />
        <YAxis stroke="#71717a" fontSize={12} />
        <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
        <Legend iconType="circle" />
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
