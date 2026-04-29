import type { ReactNode } from "react";

export type ChartContainerProps = {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

function joinClassNames(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}

export function ChartContainer({
  title,
  description,
  children,
  footer,
  className,
}: ChartContainerProps): ReactNode {
  return (
    <section
      className={joinClassNames(
        "flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950",
        className,
      )}
    >
      <header className="space-y-1">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </h3>
        {description ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        ) : null}
      </header>

      <div className="min-h-[16rem] w-full">{children}</div>

      {footer ? (
        <footer className="border-t border-zinc-100 pt-3 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          {footer}
        </footer>
      ) : null}
    </section>
  );
}
