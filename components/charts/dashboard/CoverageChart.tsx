"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DashboardCoverageItem, RiskLevel } from "@/types/api";

export type CoverageChartProps = {
  items: DashboardCoverageItem[];
};

const colorByRisk: Record<RiskLevel, string> = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#ef4444",
};

export function CoverageChart({ items }: CoverageChartProps) {
  const data = items
    .filter((item) => item.daysCoverage != null)
    .slice(0, 10)
    .map((item) => ({
      name:
        item.skuName.length > 18
          ? `${item.skuName.slice(0, 18)}…`
          : item.skuName,
      fullName: item.skuName,
      days: item.daysCoverage as number,
      risk: item.stockoutRisk,
    }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 16, bottom: 8, left: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e4e4e7" />
        <XAxis
          type="number"
          stroke="#71717a"
          fontSize={12}
          label={{
            value: "Дни покрытия",
            position: "insideBottom",
            offset: -2,
            fontSize: 11,
            fill: "#71717a",
          }}
        />
        <YAxis
          type="category"
          dataKey="name"
          stroke="#71717a"
          fontSize={12}
          width={130}
        />
        <Tooltip
          formatter={(value) => [`${value} дн.`, "Покрытие"]}
          labelFormatter={(_label, payload) =>
            (payload?.[0]?.payload as { fullName?: string })?.fullName ?? ""
          }
          contentStyle={{ borderRadius: 8, fontSize: 12 }}
        />
        <Bar dataKey="days" radius={[0, 4, 4, 0]}>
          {data.map((entry, idx) => (
            <Cell key={idx} fill={colorByRisk[entry.risk]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
