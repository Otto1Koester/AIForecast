import type { ReactNode } from "react";

export type KpiTone = "neutral" | "success" | "warning" | "danger";

export type KpiCardProps = {
  title: string;
  value: string | number;
  description?: string;
  trendLabel?: string;
  tone?: KpiTone;
  className?: string;
};

const toneStyles: Record<KpiTone, { value: string; trend: string }> = {
  neutral: {
    value: "text-zinc-900 dark:text-zinc-50",
    trend: "text-zinc-500 dark:text-zinc-400",
  },
  success: {
    value: "text-emerald-700 dark:text-emerald-300",
    trend: "text-emerald-600 dark:text-emerald-400",
  },
  warning: {
    value: "text-amber-700 dark:text-amber-300",
    trend: "text-amber-600 dark:text-amber-400",
  },
  danger: {
    value: "text-red-700 dark:text-red-300",
    trend: "text-red-600 dark:text-red-400",
  },
};

function joinClassNames(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}

export function KpiCard({
  title,
  value,
  description,
  trendLabel,
  tone = "neutral",
  className,
}: KpiCardProps): ReactNode {
  const styles = toneStyles[tone];

  return (
    <div
      className={joinClassNames(
        "rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950",
        className,
      )}
    >
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {title}
      </p>
      <p className={joinClassNames("mt-2 text-2xl font-semibold", styles.value)}>
        {value}
      </p>
      {trendLabel ? (
        <p className={joinClassNames("mt-1 text-xs font-medium", styles.trend)}>
          {trendLabel}
        </p>
      ) : null}
      {description ? (
        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
          {description}
        </p>
      ) : null}
    </div>
  );
}
