"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatUnitRu } from "@/lib/utils/format";
import type { SkuMovementDto } from "@/types/api";

const monthFormatter = new Intl.DateTimeFormat("ru-RU", {
  month: "short",
  year: "2-digit",
});

const numberFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 0,
});

function formatNumber(value: unknown): string {
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) ? numberFormatter.format(numeric) : "—";
}

function formatPeriod(period: string): string {
  const date = new Date(period);
  if (Number.isNaN(date.getTime())) return period;
  return monthFormatter.format(date);
}

export type MovementHistoryChartProps = {
  movements: SkuMovementDto[];
  unit: string;
};

export function MovementHistoryChart({
  movements,
  unit,
}: MovementHistoryChartProps) {
  const data = [...movements]
    .sort((a, b) => a.periodMonth.localeCompare(b.periodMonth))
    .map((m) => ({
      period: formatPeriod(m.periodMonth),
      inbound: m.inboundQty,
      outbound: m.outboundQty,
      writeoff: m.writeoffQty,
      ending: m.endingStock,
    }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart
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
        <Bar
          dataKey="inbound"
          name="Приход"
          fill="#10b981"
          stackId="flow"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="outbound"
          name="Расход"
          fill="#0ea5e9"
          stackId="flow"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="writeoff"
          name="Списания"
          fill="#ef4444"
          stackId="flow"
          radius={[4, 4, 0, 0]}
        />
        <Line
          type="monotone"
          dataKey="ending"
          name="Остаток на конец"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
