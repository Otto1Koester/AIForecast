import type { ReactNode } from "react";

import type { AbcClass } from "@/types/inventory";

export type AbcBadgeProps = {
  value: AbcClass | null | undefined;
  prefix?: string;
  className?: string;
};

export const ABC_CLASS_STYLES: Record<AbcClass, string> = {
  A: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900/60",
  B: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60",
  C: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/60",
};

export const ABC_CHART_COLORS: Record<AbcClass, string> = {
  A: "#e11d48",
  B: "#f59e0b",
  C: "#10b981",
};

function joinClassNames(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}

export function AbcBadge({
  value,
  prefix,
  className,
}: AbcBadgeProps): ReactNode {
  if (!value) {
    return <span className="text-zinc-400 dark:text-zinc-500">—</span>;
  }
  return (
    <span
      className={joinClassNames(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        ABC_CLASS_STYLES[value],
        className,
      )}
    >
      {prefix ? `${prefix} ${value}` : value}
    </span>
  );
}
