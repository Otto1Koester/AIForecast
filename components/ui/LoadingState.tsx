import type { ReactNode } from "react";

export type LoadingStateProps = {
  title?: string;
  description?: string;
  className?: string;
};

function joinClassNames(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}

export function LoadingState({
  title = "Загрузка...",
  description,
  className,
}: LoadingStateProps): ReactNode {
  return (
    <div
      role="status"
      aria-live="polite"
      className={joinClassNames(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-zinc-200 bg-white px-6 py-10 text-center dark:border-zinc-800 dark:bg-zinc-950",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700 dark:border-zinc-700 dark:border-t-zinc-200"
      />
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
        {title}
      </p>
      {description ? (
        <p className="max-w-md text-xs text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}
