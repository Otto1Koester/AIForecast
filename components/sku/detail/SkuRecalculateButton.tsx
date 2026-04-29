"use client";

import { useState } from "react";

import type { ApiErrorResponse } from "@/types/api";

type RecalculationStatus =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export type SkuRecalculateButtonProps = {
  skuId: string;
  onSuccess: () => Promise<void> | void;
};

function describeError(httpStatus: number | null, fallback: string): string {
  if (httpStatus === 401) {
    return "Сессия истекла. Войдите в систему ещё раз и повторите расчёт.";
  }
  if (httpStatus === 404) {
    return "SKU не найден в Supabase. Возможно, его удалили.";
  }
  if (httpStatus === 429) {
    return "Превышен лимит запросов к OpenRouter. Подождите минуту и попробуйте снова.";
  }
  if (httpStatus && httpStatus >= 500) {
    return `Серверная ошибка (${httpStatus}). ${fallback}`;
  }
  return fallback;
}

export function SkuRecalculateButton({
  skuId,
  onSuccess,
}: SkuRecalculateButtonProps) {
  const [status, setStatus] = useState<RecalculationStatus>({ kind: "idle" });

  async function handleClick() {
    setStatus({ kind: "loading" });
    try {
      const response = await fetch(`/api/ai/forecast/${skuId}`, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ force: true }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | ApiErrorResponse
          | null;
        const fallback =
          payload?.error ||
          "Не удалось пересчитать AI-прогноз. Попробуйте ещё раз через минуту.";
        setStatus({
          kind: "error",
          message: describeError(response.status, fallback),
        });
        return;
      }

      await onSuccess();
      setStatus({
        kind: "success",
        message: "AI-прогноз обновлён. Карточка перезагружена.",
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof Error
            ? `Ошибка сети: ${error.message}`
            : "Не удалось связаться с AI-эндпоинтом.",
      });
    }
  }

  const isLoading = status.kind === "loading";

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Запустить AI-прогноз
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Вызовет OpenRouter, обновит запись в Supabase и перезагрузит карточку
          SKU.
        </p>
        {status.kind === "success" ? (
          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
            {status.message}
          </p>
        ) : null}
        {status.kind === "error" ? (
          <p className="text-xs font-medium text-red-700 dark:text-red-300">
            {status.message}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-900 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {isLoading ? (
          <>
            <span
              aria-hidden
              className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white dark:border-zinc-900/30 dark:border-t-zinc-900"
            />
            Пересчитываем...
          </>
        ) : (
          <>Пересчитать AI-прогноз</>
        )}
      </button>
    </div>
  );
}
