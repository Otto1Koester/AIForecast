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

import { formatUnitRu } from "@/lib/utils/format";
import type { SkuLotDto } from "@/types/api";

const numberFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 0,
});

function formatNumber(value: unknown): string {
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) ? numberFormatter.format(numeric) : "—";
}

function colorForDays(days: number | null): string {
  if (days === null) return "#a1a1aa";
  if (days < 0) return "#7f1d1d";
  if (days <= 30) return "#ef4444";
  if (days <= 90) return "#f97316";
  if (days <= 180) return "#f59e0b";
  return "#10b981";
}

export type LotExpiryChartProps = {
  lots: SkuLotDto[];
  unit: string;
};

export function LotExpiryChart({ lots, unit }: LotExpiryChartProps) {
  const data = [...lots]
    .filter((lot) => lot.daysToExpiry !== null)
    .sort((a, b) => (a.daysToExpiry ?? 0) - (b.daysToExpiry ?? 0))
    .map((lot) => ({
      lotNumber: lot.lotNumber,
      days: lot.daysToExpiry ?? 0,
      quantity: lot.quantity,
      expiresAt: lot.expiresAt,
    }));

  return (
    <ResponsiveContainer width="100%" height={Math.max(220, data.length * 38)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 24, bottom: 8, left: 8 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={false}
          stroke="#e4e4e7"
        />
        <XAxis
          type="number"
          stroke="#71717a"
          fontSize={12}
          label={{
            value: "Дней до окончания срока",
            position: "insideBottom",
            offset: -2,
            fontSize: 11,
            fill: "#71717a",
          }}
        />
        <YAxis
          type="category"
          dataKey="lotNumber"
          stroke="#71717a"
          fontSize={12}
          width={130}
        />
        <Tooltip
          contentStyle={{ borderRadius: 8, fontSize: 12 }}
          formatter={(value: unknown, _name: unknown, item: unknown) => {
            const payload = (item as { payload?: { quantity?: number } })
              ?.payload;
            const qty = payload?.quantity;
            return [
              `${formatNumber(value)} дн. · ${formatNumber(qty)} ${formatUnitRu(unit)}`,
              "До окончания",
            ];
          }}
        />
        <Bar dataKey="days" radius={[0, 4, 4, 0]}>
          {data.map((entry, idx) => (
            <Cell key={idx} fill={colorForDays(entry.days)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
