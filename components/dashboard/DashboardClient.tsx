"use client";

import { useEffect, useState } from "react";

import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import type { DashboardResponse } from "@/types/api";

import { DashboardAbcPanel } from "./DashboardAbcPanel";
import { DashboardAiStatus } from "./DashboardAiStatus";
import { DashboardAlerts } from "./DashboardAlerts";
import { DashboardCoveragePanel } from "./DashboardCoveragePanel";
import { DashboardForecastPanel } from "./DashboardForecastPanel";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardKpiGrid } from "./DashboardKpiGrid";
import { DashboardTopRisks } from "./DashboardTopRisks";

type FetchState =
  | { status: "loading" }
  | { status: "success"; data: DashboardResponse }
  | { status: "error"; kind: "unauthorized" | "not-ready" | "generic"; message: string };

async function loadDashboard(signal: AbortSignal): Promise<FetchState> {
  try {
    const res = await fetch("/api/dashboard", {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
      signal,
      cache: "no-store",
    });

    if (res.status === 401) {
      return {
        status: "error",
        kind: "unauthorized",
        message: "Сессия истекла. Войдите снова, чтобы увидеть главную.",
      };
    }

    if (res.status === 404) {
      return {
        status: "error",
        kind: "not-ready",
        message:
          "API главной ещё не подключён. Этот экран автоматически оживёт после деплоя /api/dashboard.",
      };
    }

    if (!res.ok) {
      return {
        status: "error",
        kind: "generic",
        message: `Сервер вернул ошибку ${res.status}.`,
      };
    }

    const data = (await res.json()) as DashboardResponse;
    return { status: "success", data };
  } catch (error) {
    if ((error as { name?: string })?.name === "AbortError") {
      return { status: "loading" };
    }
    return {
      status: "error",
      kind: "generic",
      message:
        error instanceof Error
          ? error.message
          : "Не удалось связаться с /api/dashboard.",
    };
  }
}

export function DashboardClient() {
  const [state, setState] = useState<FetchState>({ status: "loading" });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    loadDashboard(controller.signal).then((next) => {
      if (!controller.signal.aborted) setState(next);
    });
    return () => controller.abort();
  }, [reloadKey]);

  const retry = () => {
    setState({ status: "loading" });
    setReloadKey((k) => k + 1);
  };

  if (state.status === "loading") {
    return (
      <div className="space-y-6">
        <DashboardHeader />
        <LoadingState
          title="Загружаем дашборд"
          description="Считываем KPI, AI-алерты и последние прогнозы из Supabase."
        />
      </div>
    );
  }

  if (state.status === "error") {
    const title =
      state.kind === "not-ready"
        ? "API главной ещё не подключён"
        : state.kind === "unauthorized"
          ? "Нужна повторная авторизация"
          : "Не удалось загрузить главную";

    return (
      <div className="space-y-6">
        <DashboardHeader />
        <ErrorState
          title={title}
          description={state.message}
          action={
            state.kind === "unauthorized" ? null : (
              <button
                type="button"
                onClick={retry}
                className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-200 dark:hover:bg-red-900"
              >
                Повторить
              </button>
            )
          }
        />
      </div>
    );
  }

  const data = state.data;

  return (
    <div className="space-y-8">
      <DashboardHeader generatedAt={data.generatedAt} />
      <DashboardKpiGrid kpis={data.kpis} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardAlerts alerts={data.alerts} />
        </div>
        <DashboardAiStatus status={data.aiStatus} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardAbcPanel items={data.abcAnalysis} />
        <DashboardCoveragePanel items={data.coverage} />
      </div>

      <DashboardForecastPanel points={data.forecastVsFact} />

      <DashboardTopRisks items={data.topRiskSkus} />
    </div>
  );
}
