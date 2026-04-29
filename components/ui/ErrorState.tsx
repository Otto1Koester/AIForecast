import type { ReactNode } from "react";

export type ErrorStateProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

function joinClassNames(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}

export function ErrorState({
  title = "Не удалось загрузить данные",
  description,
  action,
  className,
}: ErrorStateProps): ReactNode {
  return (
    <div
      role="alert"
      className={joinClassNames(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-red-200 bg-red-50 px-6 py-10 text-center dark:border-red-900/70 dark:bg-red-950/40",
        className,
      )}
    >
      <h3 className="text-base font-semibold text-red-800 dark:text-red-200">
        {title}
      </h3>
      {description ? (
        <p className="max-w-md text-sm text-red-700 dark:text-red-300">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
