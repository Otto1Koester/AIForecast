import type { ReactNode } from "react";

import type { RiskLevel } from "@/types/api";

export type RiskBadgeProps = {
  level: RiskLevel;
  label?: string;
  className?: string;
};

const defaultLabels: Record<RiskLevel, string> = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
  critical: "Критический",
};

const levelStyles: Record<RiskLevel, string> = {
  low: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/60",
  medium:
    "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60",
  high: "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:ring-orange-900/60",
  critical:
    "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900/60",
};

function joinClassNames(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}

export function RiskBadge({
  level,
  label,
  className,
}: RiskBadgeProps): ReactNode {
  const text = label ?? defaultLabels[level];

  return (
    <span
      className={joinClassNames(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        levelStyles[level],
        className,
      )}
    >
      {text}
    </span>
  );
}
