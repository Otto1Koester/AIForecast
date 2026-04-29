import type { ReactNode } from "react";

import type { SkuAiTechnicalMetadata } from "@/types/api";

import { RUN_STATUS_LABELS } from "./labels";
import { formatDateTime } from "./formatters";

type SkuAiMetadataPanelProps = {
  metadata: SkuAiTechnicalMetadata;
};

const statusStyles: Record<SkuAiTechnicalMetadata["status"], string> = {
  pending:
    "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60",
  success:
    "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/60",
  error:
    "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900/60",
  missing:
    "bg-zinc-100 text-zinc-700 ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-700",
};

function MetaRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
}): ReactNode {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
      <dt className="w-44 shrink-0 text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </dt>
      <dd
        className={`break-all text-sm text-zinc-800 dark:text-zinc-100 ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}

export function SkuAiMetadataPanel({
  metadata,
}: SkuAiMetadataPanelProps): ReactNode {
  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <header className="space-y-1">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Технический AI metadata
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Информация о последнем запуске модели для демонстрации и отладки.
        </p>
      </header>

      <dl className="space-y-3">
        <MetaRow
          label="Статус"
          value={
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[metadata.status]}`}
            >
              {RUN_STATUS_LABELS[metadata.status]}
            </span>
          }
        />
        <MetaRow label="Модель" value={metadata.model ?? "—"} mono />
        <MetaRow label="Forecast ID" value={metadata.forecastId ?? "—"} mono />
        <MetaRow label="Run ID" value={metadata.runId ?? "—"} mono />
        <MetaRow label="Input hash" value={metadata.inputHash ?? "—"} mono />
        <MetaRow
          label="Создан"
          value={formatDateTime(metadata.createdAt)}
        />
        <MetaRow
          label="Завершён"
          value={formatDateTime(metadata.finishedAt)}
        />
        {metadata.errorMessage ? (
          <MetaRow
            label="Сообщение об ошибке"
            value={
              <span className="text-red-700 dark:text-red-300">
                {metadata.errorMessage}
              </span>
            }
          />
        ) : null}
      </dl>
    </section>
  );
}
