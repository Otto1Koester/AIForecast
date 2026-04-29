"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { ABC_CHART_COLORS } from "@/components/ui/AbcBadge";
import { formatRubFromUsd } from "@/lib/utils/format";
import type { DashboardAbcItem } from "@/types/api";

export type AbcChartProps = {
  items: DashboardAbcItem[];
};

const colorByClass = ABC_CHART_COLORS;

export function AbcChart({ items }: AbcChartProps) {
  const data = items.map((item) => ({
    name: `Класс ${item.abcClass}`,
    abcClass: item.abcClass,
    value: item.inventoryValue,
    skuCount: item.skuCount,
    share: item.share,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={55}
          outerRadius={95}
          paddingAngle={2}
          stroke="none"
        >
          {data.map((entry) => (
            <Cell key={entry.abcClass} fill={colorByClass[entry.abcClass]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, _name, item) => {
            const payload = (item as { payload?: { skuCount: number; share: number } })
              ?.payload;
            const numeric = typeof value === "number" ? value : Number(value);
            const share = payload ? Math.round(payload.share * 100) : null;
            const sku = payload ? `${payload.skuCount} SKU` : "";
            return [
              `${formatRubFromUsd(numeric)}${share != null ? ` · ${share}%` : ""} · ${sku}`,
              "Стоимость запасов",
            ];
          }}
          contentStyle={{ borderRadius: 8, fontSize: 12 }}
        />
        <Legend verticalAlign="bottom" height={28} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
}
