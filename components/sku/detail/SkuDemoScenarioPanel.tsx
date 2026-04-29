"use client";

import { useState } from "react";

import type {
  ApiErrorResponse,
  DemoScenario,
  DemoScenarioResponse,
} from "@/types/api";

type DemoScenarioStatus =
  | { kind: "idle" }
  | { kind: "loading"; scenario: DemoScenario }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

type SkuDemoScenarioPanelProps = {
  skuId: string;
  onSuccess: () => Promise<void> | void;
};

const scenarioButtons: ReadonlyArray<{
  scenario: DemoScenario;
  label: string;
  tone: "danger" | "warning" | "neutral";
}> = [
  {
    scenario: "stockout",
    label: "Симулировать дефицит",
    tone: "danger",
  },
  {
    scenario: "overstock",
    label: "Симулировать избыток",
    tone: "warning",
  },
  {
    scenario: "reset",
    label: "Сбросить демо-сценарий",
    tone: "neutral",
  },
];

const toneClassNames = {
  danger:
    "border-red-300 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-900/70 dark:bg-red-950/30 dark:text-red-200 dark:hover:bg-red-950/50",
  warning:
    "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200 dark:hover:bg-amber-950/50",
  neutral:
    "border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900",
} as const;

function getSuccessMessage(response: DemoScenarioResponse): string {
  if (response.scenario === "reset") {
    return "Демо-сценарий сброшен. Нажмите «Пересчитать AI-прогноз», если хотите обновить AI-анализ.";
  }

  return "Сценарий применён. Нажмите «Пересчитать AI-прогноз».";
}

function describeError(httpStatus: number | null, fallback: string): string {
  if (httpStatus === 401) {
    return "Сессия истекла. Войдите в систему ещё раз и повторите сценарий.";
  }

  if (httpStatus === 404) {
    return "SKU не найден в Supabase. Возможно, его удалили.";
  }

  if (httpStatus === 409) {
    return fallback;
  }

  if (httpStatus && httpStatus >= 500) {
    return `Серверная ошибка (${httpStatus}). ${fallback}`;
  }

  return fallback;
}

export function SkuDemoScenarioPanel({
  skuId,
  onSuccess,
}: SkuDemoScenarioPanelProps) {
  const [status, setStatus] = useState<DemoScenarioStatus>({ kind: "idle" });

  async function applyScenario(scenario: DemoScenario) {
    setStatus({ kind: "loading", scenario });

    try {
      const response = await fetch(`/api/sku/${skuId}/demo-scenario`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ scenario }),
      });

      const payload = (await response.json().catch(() => null)) as
        | ApiErrorResponse
        | DemoScenarioResponse
        | null;

      if (!response.ok) {
        const fallback =
          payload && "error" in payload
            ? payload.error
            : "Не удалось применить демо-сценарий.";
        setStatus({
          kind: "error",
          message: describeError(response.status, fallback),
        });
        return;
      }

      const result = payload as DemoScenarioResponse;
      await onSuccess();
      setStatus({
        kind: "success",
        message: getSuccessMessage(result),
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof Error
            ? `Ошибка сети: ${error.message}`
            : "Не удалось связаться с demo endpoint.",
      });
    }
  }

  const isLoading = status.kind === "loading";

  return (
    <section className="space-y-4 rounded-lg border border-amber-200 bg-amber-50/50 p-5 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
      <header className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Демо-сценарии
          </h2>
          <span className="rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
            Только для интервью
          </span>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Измените demo-данные по этой товарной позиции, затем вручную
          запустите пересчёт AI-прогноза.
        </p>
      </header>

      <p className="rounded-md border border-amber-200 bg-white/70 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/70 dark:bg-zinc-950/60 dark:text-amber-200">
        Используется только для демонстрации сценариев на интервью.
      </p>

      <div className="flex flex-wrap gap-2">
        {scenarioButtons.map((button) => {
          const isCurrentLoading =
            status.kind === "loading" && status.scenario === button.scenario;

          return (
            <button
              key={button.scenario}
              type="button"
              onClick={() => applyScenario(button.scenario)}
              disabled={isLoading}
              className={`inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${toneClassNames[button.tone]}`}
            >
              {isCurrentLoading ? (
                <span
                  aria-hidden
                  className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current/30 border-t-current"
                />
              ) : null}
              {button.label}
            </button>
          );
        })}
      </div>

      {status.kind === "success" ? (
        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
          {status.message}
        </p>
      ) : null}

      {status.kind === "error" ? (
        <p className="text-sm font-medium text-red-700 dark:text-red-300">
          {status.message}
        </p>
      ) : null}
    </section>
  );
}
