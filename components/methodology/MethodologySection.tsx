import type { ReactNode } from "react";

export type MethodologySectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export type MethodologyCardProps = {
  title: string;
  description: string;
  badge?: string;
  children?: ReactNode;
  className?: string;
};

function joinClassNames(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}

export function MethodologySection({
  eyebrow,
  title,
  description,
  children,
  className,
}: MethodologySectionProps): ReactNode {
  return (
    <section className={joinClassNames("space-y-5", className)}>
      <div className="max-w-3xl space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
        {description ? (
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        ) : null}
      </div>

      {children}
    </section>
  );
}

export function MethodologyCard({
  title,
  description,
  badge,
  children,
  className,
}: MethodologyCardProps): ReactNode {
  return (
    <article
      className={joinClassNames(
        "rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </h3>
        {badge ? <MethodologyBadge>{badge}</MethodologyBadge> : null}
      </div>
      <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
      {children ? <div className="mt-4">{children}</div> : null}
    </article>
  );
}

export function MethodologyBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger";
}): ReactNode {
  const toneClassNames = {
    neutral:
      "bg-zinc-100 text-zinc-700 ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-800",
    success:
      "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/60",
    warning:
      "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60",
    danger:
      "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900/60",
  };

  return (
    <span
      className={joinClassNames(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        toneClassNames[tone],
      )}
    >
      {children}
    </span>
  );
}

export function MethodologyCheckList({
  items,
}: {
  items: string[];
}): ReactNode {
  return (
    <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span
            aria-hidden="true"
            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
