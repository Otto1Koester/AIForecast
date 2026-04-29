"use client";

import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import type {
  ApiErrorResponse,
  SkuListItem,
  SkuListMeta,
  SkuListResponse,
} from "@/types/api";

import { SkuCatalogCardGrid } from "./SkuCatalogCardGrid";
import { SkuCatalogSummary } from "./SkuCatalogSummary";
import { SkuCatalogTable } from "./SkuCatalogTable";
import { SkuCatalogToolbar } from "./SkuCatalogToolbar";
import {
  type CatalogFiltersState,
  DEFAULT_FILTERS,
  applyFiltersAndSort,
  uniqueCategories,
  uniqueStorageConditions,
} from "./sorting";

type FetchState =
  | { status: "loading" }
  | { status: "success"; data: SkuListResponse }
  | { status: "error"; httpStatus: number | null; message: string };

const INITIAL_STATE: FetchState = { status: "loading" };
const EMPTY_ITEMS: SkuListItem[] = [];

async function loadCatalog(signal: AbortSignal): Promise<FetchState | null> {
  try {
    const response = await fetch("/api/sku", {
      method: "GET",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal,
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | ApiErrorResponse
        | null;
      return {
        status: "error",
        httpStatus: response.status,
        message: payload?.error ?? response.statusText,
      };
    }

    const data = (await response.json()) as SkuListResponse;
    return { status: "success", data };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return null;
    }
    return {
      status: "error",
      httpStatus: null,
      message:
        error instanceof Error
          ? error.message
          : "Не удалось загрузить каталог.",
    };
  }
}

function describeError(state: Extract<FetchState, { status: "error" }>): {
  title: string;
  description: string;
} {
  if (state.httpStatus === 401) {
    return {
      title: "Сессия истекла",
      description:
        "Войдите в систему заново, чтобы продолжить работу с каталогом SKU.",
    };
  }
  if (state.httpStatus === 404) {
    return {
      title: "SKU API ещё не подключён",
      description:
        "Эндпоинт /api/sku появится после слияния ветки feature/data-api. Каталог уже готов к работе и подключится автоматически.",
    };
  }
  return {
    title: "Не удалось загрузить каталог",
    description:
      state.message ||
      "Произошла ошибка при загрузке списка SKU. Попробуйте обновить страницу.",
  };
}

export function SkuCatalogClient() {
  const [state, setState] = useState<FetchState>(INITIAL_STATE);
  const [reloadToken, setReloadToken] = useState(0);
  const [filters, setFilters] = useState<CatalogFiltersState>(DEFAULT_FILTERS);

  useEffect(() => {
    const controller = new AbortController();
    loadCatalog(controller.signal).then((next) => {
      if (next && !controller.signal.aborted) {
        setState(next);
      }
    });
    return () => controller.abort();
  }, [reloadToken]);

  const items = useMemo<SkuListItem[]>(
    () => (state.status === "success" ? state.data.items : EMPTY_ITEMS),
    [state],
  );
  const meta = useMemo<SkuListMeta | null>(
    () => (state.status === "success" ? state.data.meta : null),
    [state],
  );

  const categories = useMemo(() => uniqueCategories(items), [items]);
  const storageConditions = useMemo(
    () => uniqueStorageConditions(items),
    [items],
  );
  const filteredItems = useMemo(
    () => applyFiltersAndSort(items, filters),
    [items, filters],
  );

  function handleRetry() {
    setState({ status: "loading" });
    setReloadToken((token) => token + 1);
  }

  if (state.status === "loading") {
    return (
      <LoadingState
        title="Загружаем каталог SKU"
        description="Получаем актуальные остатки и AI-рекомендации"
      />
    );
  }

  if (state.status === "error") {
    const { title, description } = describeError(state);
    return (
      <ErrorState
        title={title}
        description={description}
        action={
          <button
            type="button"
            onClick={handleRetry}
            className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-200 dark:hover:bg-red-950"
          >
            Повторить попытку
          </button>
        }
      />
    );
  }

  if (!meta || items.length === 0) {
    return (
      <EmptyState
        title="В каталоге пока нет SKU"
        description="Когда в Supabase появятся товарные позиции, они отобразятся здесь автоматически."
      />
    );
  }

  return (
    <div className="space-y-6">
      <SkuCatalogSummary items={items} meta={meta} />

      <SkuCatalogToolbar
        filters={filters}
        onChange={setFilters}
        categories={categories}
        storageConditions={storageConditions}
        matchedCount={filteredItems.length}
        totalCount={items.length}
      />

      {filteredItems.length === 0 ? (
        <EmptyState
          title="Ничего не найдено"
          description="Попробуйте изменить поисковый запрос или сбросить фильтры."
          action={
            <button
              type="button"
              onClick={() => setFilters({ ...DEFAULT_FILTERS })}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              Сбросить фильтры
            </button>
          }
        />
      ) : (
        <>
          <div className="hidden md:block">
            <SkuCatalogTable items={filteredItems} />
          </div>
          <div className="md:hidden">
            <SkuCatalogCardGrid items={filteredItems} />
          </div>
        </>
      )}
    </div>
  );
}
