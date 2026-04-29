"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import type { ApiErrorResponse, SkuDetailResponse } from "@/types/api";

import { SkuAiInsightsPanel } from "./SkuAiInsightsPanel";
import { SkuAiMetadataPanel } from "./SkuAiMetadataPanel";
import { SkuDetailHeader } from "./SkuDetailHeader";
import { SkuDetailMetrics } from "./SkuDetailMetrics";
import { SkuForecastPanel } from "./SkuForecastPanel";
import { SkuLotsPanel } from "./SkuLotsPanel";
import { SkuMovementsPanel } from "./SkuMovementsPanel";
import { SkuRecalculateButton } from "./SkuRecalculateButton";
import { SkuRecommendationsPanel } from "./SkuRecommendationsPanel";
import { SkuReorderPanel } from "./SkuReorderPanel";
import { SkuRiskPanel } from "./SkuRiskPanel";

type FetchState =
  | { status: "loading" }
  | { status: "success"; data: SkuDetailResponse }
  | {
      status: "error";
      kind: "unauthorized" | "not-found" | "generic";
      message: string;
    };

const INITIAL_STATE: FetchState = { status: "loading" };

async function loadDetail(
  skuId: string,
  signal: AbortSignal,
): Promise<FetchState | null> {
  try {
    const response = await fetch(`/api/sku/${skuId}`, {
      method: "GET",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal,
    });

    if (response.status === 401) {
      return {
        status: "error",
        kind: "unauthorized",
        message:
          "Сессия истекла. Войдите в систему заново, чтобы посмотреть карточку SKU.",
      };
    }

    if (response.status === 404) {
      return {
        status: "error",
        kind: "not-found",
        message:
          "Такой SKU не найден в Supabase. Возможно, его удалили или ID указан неверно.",
      };
    }

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | ApiErrorResponse
        | null;
      return {
        status: "error",
        kind: "generic",
        message:
          payload?.error ??
          `Сервер вернул ошибку ${response.status}. Попробуйте обновить страницу.`,
      };
    }

    const data = (await response.json()) as SkuDetailResponse;
    return { status: "success", data };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return null;
    }
    return {
      status: "error",
      kind: "generic",
      message:
        error instanceof Error
          ? error.message
          : "Не удалось связаться с /api/sku.",
    };
  }
}

export type SkuDetailClientProps = {
  skuId: string;
};

export function SkuDetailClient({ skuId }: SkuDetailClientProps) {
  const [state, setState] = useState<FetchState>(INITIAL_STATE);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    loadDetail(skuId, controller.signal).then((next) => {
      if (next && !cancelled && !controller.signal.aborted) {
        setState(next);
      }
    });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [skuId, reloadToken]);

  const refresh = useCallback(async () => {
    setState({ status: "loading" });
    setReloadToken((token) => token + 1);
  }, []);

  const retry = useCallback(() => {
    setState({ status: "loading" });
    setReloadToken((token) => token + 1);
  }, []);

  if (state.status === "loading") {
    return (
      <LoadingState
        title="Загружаем карточку SKU"
        description="Считываем паспорт, партии, историю движения и AI-анализ из Supabase."
      />
    );
  }

  if (state.status === "error") {
    const title =
      state.kind === "unauthorized"
        ? "Нужна повторная авторизация"
        : state.kind === "not-found"
          ? "SKU не найден"
          : "Не удалось загрузить карточку SKU";

    return (
      <ErrorState
        title={title}
        description={state.message}
        action={
          state.kind === "unauthorized" ? (
            <Link
              href="/login"
              className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-200 dark:hover:bg-red-900"
            >
              Перейти ко входу
            </Link>
          ) : state.kind === "not-found" ? (
            <Link
              href="/sku"
              className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-200 dark:hover:bg-red-900"
            >
              Вернуться к каталогу
            </Link>
          ) : (
            <button
              type="button"
              onClick={retry}
              className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-200 dark:hover:bg-red-900"
            >
              Повторить попытку
            </button>
          )
        }
      />
    );
  }

  const data = state.data;
  const unit = data.header.unit;
  const ai = data.latestAiForecast;

  if (!data.header) {
    return (
      <EmptyState
        title="Данных по SKU нет"
        description="Когда позиция появится в Supabase, карточка автоматически наполнится."
      />
    );
  }

  return (
    <div className="space-y-6">
      <SkuDetailHeader header={data.header} />

      <SkuRecalculateButton skuId={skuId} onSuccess={refresh} />

      <SkuDetailMetrics metrics={data.metrics} />

      <SkuLotsPanel lots={data.lots} unit={unit} />

      <SkuMovementsPanel movements={data.movements} unit={unit} />

      <SkuForecastPanel
        points={data.forecastVsFact}
        latestAiForecast={ai}
        unit={unit}
      />

      <SkuReorderPanel reorder={data.reorder} unit={unit} />

      <SkuRiskPanel risks={ai?.analysis.risks ?? null} unit={unit} />

      <SkuRecommendationsPanel
        recommendations={ai?.recommendations ?? []}
        unit={unit}
      />

      <SkuAiInsightsPanel
        forecast={ai?.analysis.forecast ?? null}
        executiveSummary={ai?.analysis.executiveSummary ?? null}
      />

      <SkuAiMetadataPanel metadata={data.aiMetadata} />
    </div>
  );
}
