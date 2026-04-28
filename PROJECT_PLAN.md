# AIForecast — PROJECT_PLAN

Статус: финальный план перед началом разработки MVP  
Дата фиксации: 2026-04-28  
Дедлайн тестового задания: 2026-04-29 16:00  
Цель: за 1 день разработать и задеплоить демонстрационный веб-сервис AIForecast для AI-прогнозирования запасов лекарственных средств.

---

## 1. Контекст и цель проекта

AIForecast — это MVP веб-сервиса для фармацевтической компании полного цикла, где данные о запасах, движении товаров и закупках обычно хранятся в разрозненных системах.

Бизнес-проблема:

- на складах возникают и избытки, и дефициты;
- перезаказ часто делается вручную и «по ощущениям»;
- сезонные всплески спроса застают закупки врасплох;
- медленно оборачиваемые позиции занимают складское место;
- срок годности приводит к риску списаний;
- бизнесу нужен инструмент, который заранее показывает риски и рекомендует действия.

Главная цель MVP — показать на демо не просто статические страницы, а работающий продукт с реальным AI-прогнозированием через OpenRouter.

---

## 2. Принятые решения

Перед началом разработки подтверждены следующие решения:

1. **Стек**: Next.js App Router, React, TypeScript, Tailwind CSS, Recharts, Supabase, OpenRouter, Vercel.
2. **Backend**: только Next.js Route Handlers внутри `app/api/`.
3. **Отдельный backend не делаем**: без Express, Fastify, NestJS, FastAPI и других отдельных backend-сервисов.
4. **Авторизация**: простая, без регистрации, один пользователь хранится в Supabase с `password_hash`.
5. **Данные**: синтетические demo data хранятся в Supabase, а не в TypeScript-коде.
6. **Supabase**: используем cloud Supabase. Локальный Supabase через Docker не используем.
7. **AI**: реальный вызов OpenRouter API, structured JSON, сохранение результата в Supabase.
8. **AI-прогноз**: AI является главным forecast/decision engine, а не декоративным генератором текста.
9. **UI-страницы**: `/login`, `/`, `/sku`, `/sku/[id]`, `/methodology`.
10. **Деплой**: Vercel.
11. **GitHub**: основной репозиторий `Otto1Koester/AIForecast`.
12. **Параллельная разработка**: используем `git worktree`, если это ускоряет работу; ответственность за соблюдение границ файлов и порядок merge — на руководителе разработки.
13. **PROJECT_PLAN.md**: не содержит начальные промпты.
14. **PROMPTS.md**: ведётся отдельно в согласованном формате.

---

## 3. Критерии успешной сдачи

К финальной сдаче должны быть готовы:

1. Рабочее приложение, доступное по публичному URL.
2. GitHub-репозиторий с понятной историей коммитов.
3. `README.md` с описанием продукта, архитектуры, принятых решений и инструкцией запуска.
4. `PROMPTS.md` с историей важных промптов, использованных при создании проекта.
5. Supabase-база с демонстрационными данными.
6. Реальная AI-интеграция через OpenRouter.
7. Авторизация через demo user.
8. Дашборд с ABC-анализом, днями покрытия, forecast vs fact и AI-алертами.
9. Каталог SKU.
10. Карточка SKU с историей движения, партиями, сроками годности, AI-прогнозом, ROP/EOQ и рекомендациями.
11. Страница методологии.
12. Проверенный flow: login → dashboard → catalog → SKU detail → AI recalculation.

---

## 4. Продуктовый фокус MVP

MVP должен выглядеть как законченный демо-продукт для интервью.

Основной пользовательский сценарий:

1. Пользователь открывает приложение.
2. Проходит простую авторизацию.
3. Попадает на домашний дашборд.
4. Видит ключевые риски по запасам.
5. Открывает каталог SKU.
6. Переходит в карточку конкретного SKU.
7. Видит историю движения, партии и сроки годности.
8. Видит AI-прогноз потребности на 1/3/6 месяцев.
9. Видит AI-расчёт ROP/EOQ с объяснением.
10. Видит AI-рекомендации: перезаказать, ускорить реализацию, списать или мониторить.
11. Может нажать кнопку `Пересчитать AI-прогноз`, чтобы показать реальный вызов AI во время демо.

---

## 5. Стек

### 5.1. Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Recharts

### 5.2. Backend

- Next.js Route Handlers внутри `app/api/`
- Server-side работа с Supabase
- Server-side работа с OpenRouter
- HttpOnly cookie для demo auth

### 5.3. Database

- Supabase Postgres
- SQL schema в репозитории
- SQL seed/demo data в репозитории
- Реальные demo data загружаются в Supabase cloud
- Локальный Supabase через Docker не используется

### 5.4. AI

- OpenRouter API
- OpenAI-compatible client
- Модель задаётся через `OPENROUTER_MODEL`
- Ответ AI должен быть structured JSON
- AI-ответ валидируется на сервере
- AI-ответ сохраняется в Supabase

### 5.5. Deploy

- GitHub
- Vercel
- Environment variables в Vercel

---

## 6. Архитектурный принцип AI

### 6.1. Что делает AI

AI получает структурированный контекст по SKU:

- паспорт SKU;
- текущий остаток;
- партии и сроки годности;
- историю движения за 18 месяцев;
- приходы;
- расходы;
- списания;
- lead time поставщика;
- стоимость единицы;
- стоимость заказа;
- стоимость хранения;
- условия хранения;
- категорию препарата;
- сезонный контекст;
- информацию об аномалиях.

AI возвращает:

- прогноз потребности на 1 месяц;
- прогноз потребности на 3 месяца;
- прогноз потребности на 6 месяцев;
- анализ сезонности;
- анализ тренда;
- найденные аномалии;
- ROP;
- EOQ;
- объяснение параметров ROP/EOQ;
- риск дефицита;
- риск затоваривания;
- риск списания из-за срока годности;
- рекомендации действий;
- уровень уверенности;
- краткое executive summary.

### 6.2. Что делает код

Код не строит отдельный deterministic forecast engine.

Код выполняет вспомогательную работу:

- читает данные из Supabase;
- собирает входной контекст для AI;
- нормализует историю по месяцам;
- считает простые справочные метрики для передачи AI;
- вызывает OpenRouter;
- требует structured JSON;
- валидирует ответ;
- не допускает явно невозможные значения, например отрицательный прогноз, отрицательный ROP или отрицательный EOQ;
- сохраняет AI-результат в Supabase;
- отдаёт сохранённый результат в UI.

Итоговые бизнес-числа прогноза, ROP, EOQ, рисков и рекомендаций в UI берутся из AI-анализа, сохранённого в `ai_forecasts`.

---

## 7. Страницы приложения

## 7.1. `/login` — авторизация

Функции:

- форма `username/password`;
- регистрации нет;
- один demo user хранится в Supabase;
- пароль хранится как hash;
- при успешном входе создаётся httpOnly session cookie;
- после входа пользователь попадает на `/`;
- при logout cookie удаляется.

UI:

- название продукта;
- краткое описание;
- поля username/password;
- кнопка входа;

---

## 7.2. `/` — домашний дашборд

Цель: за 30 секунд показать ценность продукта.

Блоки:

1. Верхние KPI:
   - всего SKU;
   - SKU с риском дефицита;
   - SKU с риском затоваривания;
   - потенциальные списания;
   - ожидаемый эффект/экономия.
2. AI-алерты:
   - позиция закончится через N дней;
   - позиция имеет риск затоваривания;
   - партия близка к окончанию срока годности;
   - спрос отклонился от прогноза.
3. ABC-анализ.
4. Дни покрытия.
5. Forecast vs fact.
6. Топ SKU по риску.
7. Статус AI:
   - модель;
   - дата последнего расчёта;
   - источник результата;
   - confidence.

---

## 7.3. `/sku` — каталог SKU

Элементы таблицы:

- препарат;
- форма выпуска;
- категория;
- условия хранения;
- срок годности;
- текущий остаток;
- дни покрытия;
- ABC-класс;
- ROP;
- EOQ;
- AI-риск;
- AI-рекомендация.

Фильтры:

- риск дефицита;
- риск затоваривания;
- риск срока годности;
- ABC A/B/C;
- условия хранения;
- категория.

Сортировка:

- по риску;
- по дням покрытия;
- по текущему остатку;
- по стоимости;
- по ближайшему сроку годности.

---

## 7.4. `/sku/[id]` — карточка SKU

Элементы:

- паспорт SKU;
- текущий остаток;
- партии и сроки годности;
- история движения;
- приход/расход/списания;
- forecast vs fact;
- AI-прогноз на 1/3/6 месяцев;
- AI-анализ сезонности;
- AI-анализ тренда;
- AI-найденные аномалии;
- AI-расчёт ROP/EOQ;
- объяснение ROP/EOQ;
- риски дефицита, затоваривания и списания;
- рекомендации действий;
- кнопка `Пересчитать AI-прогноз`;
- технический блок для демо:
  - модель;
  - timestamp;
  - confidence;
  - input period.

---

## 7.5. `/methodology` — методология

Страница нужна, чтобы на интервью было легко объяснить подход.

Содержимое:

- что анализирует AI;
- какие данные получает AI;
- как AI учитывает сезонность;
- как AI учитывает тренды;
- как AI определяет аномалии;
- что такое ROP;
- что такое EOQ;
- как интерпретируются риски;
- почему используется кэширование AI-результатов;
- какие ограничения есть у MVP;
- как после MVP можно подключить ERP/WMS/MES.

---

## 8. API внутри Next.js

Backend находится только в `app/api/`.

Предлагаемые endpoints:

```text
app/api/auth/login/route.ts
app/api/auth/logout/route.ts
app/api/auth/me/route.ts

app/api/dashboard/route.ts
app/api/sku/route.ts
app/api/sku/[id]/route.ts

app/api/ai/forecast/[skuId]/route.ts
app/api/ai/forecast/batch/route.ts
```

### 8.1. Auth endpoints

`POST /api/auth/login`

- принимает username/password;
- читает пользователя из Supabase;
- сравнивает password с `password_hash`;
- создаёт signed session cookie;
- возвращает пользователя без `password_hash`.

`POST /api/auth/logout`

- очищает cookie.

`GET /api/auth/me`

- проверяет cookie;
- возвращает текущего пользователя.

### 8.2. Data endpoints

`GET /api/dashboard`

- собирает KPI;
- берёт последние AI-прогнозы;
- возвращает данные для дашборда.

`GET /api/sku`

- возвращает каталог SKU с последним AI-анализом.

`GET /api/sku/[id]`

- возвращает паспорт SKU;
- возвращает партии;
- возвращает историю движения;
- возвращает последний AI-анализ.

### 8.3. AI endpoints

`POST /api/ai/forecast/[skuId]`

- проверяет авторизацию;
- собирает SKU-контекст из Supabase;
- вызывает OpenRouter;
- требует structured JSON;
- валидирует ответ;
- сохраняет результат в `ai_forecasts`;
- пишет run-log в `ai_forecast_runs`;
- возвращает новый AI-анализ.

`POST /api/ai/forecast/batch`

- нужен для подготовки демо;
- пересчитывает AI-прогнозы для выбранных SKU;
- использует `AI_BATCH_LIMIT`;
- не запускается автоматически на каждый render.

---

## 9. Supabase schema

Минимальные таблицы:

```text
app_users
sku_items
inventory_lots
inventory_movements
ai_forecasts
ai_forecast_runs
```

### 9.1. `app_users`

```sql
app_users (
  id uuid primary key,
  username text unique not null,
  password_hash text not null,
  display_name text,
  created_at timestamptz default now()
)
```

### 9.2. `sku_items`

```sql
sku_items (
  id uuid primary key,
  name text not null,
  dosage_form text not null,
  category text not null,
  storage_condition text not null,
  shelf_life_days int not null,
  current_stock numeric not null,
  unit text not null,
  unit_cost numeric not null,
  order_cost numeric not null,
  holding_cost_rate numeric not null,
  lead_time_days int not null,
  service_level numeric not null,
  supplier text not null,
  created_at timestamptz default now()
)
```

### 9.3. `inventory_lots`

```sql
inventory_lots (
  id uuid primary key,
  sku_id uuid references sku_items(id),
  lot_number text not null,
  quantity numeric not null,
  received_at date not null,
  expires_at date not null,
  created_at timestamptz default now()
)
```

### 9.4. `inventory_movements`

```sql
inventory_movements (
  id uuid primary key,
  sku_id uuid references sku_items(id),
  period_month date not null,
  inbound_qty numeric not null,
  outbound_qty numeric not null,
  writeoff_qty numeric not null,
  ending_stock numeric not null,
  anomaly_flag boolean default false,
  anomaly_note text,
  created_at timestamptz default now()
)
```

### 9.5. `ai_forecasts`

```sql
ai_forecasts (
  id uuid primary key,
  sku_id uuid references sku_items(id),
  model text not null,
  input_hash text not null,
  forecast_1m numeric not null,
  forecast_3m numeric not null,
  forecast_6m numeric not null,
  rop numeric not null,
  eoq numeric not null,
  stockout_risk text not null,
  overstock_risk text not null,
  expiry_risk text not null,
  confidence numeric,
  analysis jsonb not null,
  raw_response jsonb,
  created_at timestamptz default now()
)
```

### 9.6. `ai_forecast_runs`

```sql
ai_forecast_runs (
  id uuid primary key,
  sku_id uuid references sku_items(id),
  status text not null,
  model text not null,
  input_hash text,
  error_message text,
  created_at timestamptz default now(),
  finished_at timestamptz
)
```

---

## 10. Demo data

Demo data должны быть синтетическими, но достаточно реалистичными для фармацевтического контекста.

Минимальный набор:

- 15–25 SKU;
- 18 месяцев истории движения;
- 2–4 партии на ключевых SKU;
- один demo user;
- несколько заранее сохранённых AI-прогнозов или batch generation перед демо.

Обязательные сценарии:

1. Быстро оборачиваемый SKU с риском дефицита.
2. Медленно оборачиваемый SKU с риском затоваривания.
3. SKU с зимней сезонностью.
4. SKU с летним сезонным спросом.
5. SKU с аномальным списанием.
6. Дорогой SKU класса A.
7. SKU класса C, занимающий складское место.
8. SKU с коротким остаточным сроком годности.
9. SKU с длинным lead time поставщика.
10. SKU, у которого факт резко разошёлся с прогнозом.

---

## 11. AI response schema

В TypeScript описываем схему примерно такого вида:

```ts
type AiForecastAnalysis = {
  skuId: string;
  forecast: {
    oneMonthDemand: number;
    threeMonthDemand: number;
    sixMonthDemand: number;
    confidence: number;
    trend: 'declining' | 'stable' | 'growing';
    seasonality: string;
    anomalies: Array<{
      period: string;
      type: 'spike' | 'drop' | 'writeoff' | 'supply_gap';
      explanation: string;
    }>;
  };
  reorder: {
    rop: number;
    eoq: number;
    safetyStock: number;
    leadTimeDemand: number;
    explanation: string;
  };
  risks: {
    stockout: {
      level: 'low' | 'medium' | 'high' | 'critical';
      daysToStockout: number | null;
      explanation: string;
    };
    overstock: {
      level: 'low' | 'medium' | 'high' | 'critical';
      daysCoverage: number | null;
      explanation: string;
    };
    expiry: {
      level: 'low' | 'medium' | 'high' | 'critical';
      quantityAtRisk: number;
      explanation: string;
    };
  };
  recommendations: Array<{
    action: 'reorder' | 'accelerate_sales' | 'write_off' | 'monitor' | 'adjust_safety_stock';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    suggestedQuantity?: number;
    deadlineDays?: number;
    reasoning: string;
  }>;
  executiveSummary: string;
};
```

Требование: UI и API должны работать со structured JSON, а не парсить свободный текст модели.

---

## 12. Environment variables

`.env.example`:

```text
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
OPENROUTER_API_KEY=
OPENROUTER_MODEL=openai/gpt-4o-mini
OPENROUTER_SITE_URL=http://localhost:3000
OPENROUTER_APP_TITLE=AIForecast
AI_BATCH_LIMIT=5
```

Правила:

- `OPENROUTER_API_KEY` не отправляем в браузер;
- `SUPABASE_SERVICE_ROLE_KEY` не отправляем в браузер;
- `JWT_SECRET` не отправляем в браузер;
- Supabase service role используем только в server-side Route Handlers;
- UI получает данные только через наши Next.js API endpoints;
- если позже понадобится Supabase client на frontend, отдельно добавим anon key и RLS-политики.

---

## 13. Структура проекта

```text
AIForecast
├─ app/
│  ├─ login/page.tsx
│  ├─ page.tsx
│  ├─ sku/page.tsx
│  ├─ sku/[id]/page.tsx
│  ├─ methodology/page.tsx
│  └─ api/
│     ├─ auth/login/route.ts
│     ├─ auth/logout/route.ts
│     ├─ auth/me/route.ts
│     ├─ dashboard/route.ts
│     ├─ sku/route.ts
│     ├─ sku/[id]/route.ts
│     └─ ai/forecast/[skuId]/route.ts
├─ components/
│  ├─ auth/
│  ├─ dashboard/
│  ├─ sku/
│  ├─ charts/
│  └─ ui/
├─ lib/
│  ├─ auth/
│  ├─ supabase/
│  ├─ ai/
│  ├─ dashboard/
│  └─ utils/
├─ types/
│  ├─ inventory.ts
│  └─ ai.ts
├─ supabase/
│  ├─ migrations/
│  └─ seed.sql
├─ README.md
├─ PROMPTS.md
└─ PROJECT_PLAN.md
```

---

## 14. Распределение работы между агентами

## 14.1. Cursor Agent

Cursor используем не только как IDE, но и как полноценного агента.

Задачи:

- инициализация проекта;
- создание базовой структуры;
- интеграция веток;
- правки после merge;
- запуск dev/build;
- исправление связности между UI, API и БД;
- финальная сборка;
- рефакторинг после Codex/Claude;
- проверка, что приложение запускается целиком.

## 14.2. Codex

Codex лучше использовать для точного backend/TypeScript-кода.

Задачи:

- Supabase schema;
- SQL seed;
- API Route Handlers;
- auth helpers;
- password hashing;
- cookie/session helpers;
- OpenRouter client;
- JSON schema / Zod validation;
- обработка ошибок;
- build/lint fixes.

## 14.3. Claude

Claude лучше использовать для UX, структуры страниц, текстов и документации.

Задачи:

- dashboard layout;
- SKU catalog UI;
- SKU detail UI;
- methodology page;
- microcopy;
- README;
- проверка полноты требований;
- финальная полировка интерфейса.

## 14.4. Chrome DevTools MCP

Используем на финальном этапе:

- smoke-test страниц;
- проверка console errors;
- проверка network errors;
- responsive-проверка;
- проверка flow login → dashboard → SKU → AI forecast.

---

## 15. Параллельная работа через git worktree

Параллельную работу используем только после того, как создан базовый Next.js-проект и зафиксированы общие типы/API-контракты.

### 15.1. Базовый принцип

Создаём основную интеграционную ветку:

```text
feature/mvp
```

От неё создаём worktree-ветки:

```text
feature/db-supabase
feature/auth-api
feature/ai-engine
feature/ui-dashboard
feature/docs
```

Каждая ветка имеет строго ограниченную зону ответственности.

Ответственность за соблюдение границ:

- руководитель разработки заранее выдаёт каждому агенту allowlist/denylist файлов, при необходимости агент может исправить файлы из denylist по предварительному запросу и эта инструкция передается агенту явно;
- после работы агента проверяется `git diff --stat`;
- если агент изменил чужие файлы, эти изменения не принимаются без отдельного решения;
- перед merge обязательно запускается build/lint в интеграционной ветке.

---

## 15.2. Подготовка worktree в PowerShell

Из корня основного репозитория:

```powershell
git status
git checkout -b feature/mvp
git push -u origin feature/mvp
```

Создать соседние рабочие деревья:

```powershell
git worktree add -b feature/db-supabase ..\AIForecast-db-supabase feature/mvp
git worktree add -b feature/auth-api ..\AIForecast-auth-api feature/mvp
git worktree add -b feature/ai-engine ..\AIForecast-ai-engine feature/mvp
git worktree add -b feature/ui-dashboard ..\AIForecast-ui-dashboard feature/mvp
git worktree add -b feature/docs ..\AIForecast-docs feature/mvp
```

Открыть каждую папку в отдельном окне Cursor:

```text
AIForecast-db-supabase
AIForecast-auth-api
AIForecast-ai-engine
AIForecast-ui-dashboard
AIForecast-docs
```

---

## 15.3. Границы файлов по веткам

### `feature/db-supabase`

Можно менять:

- `supabase/migrations/*`
- `supabase/seed.sql`
- `types/inventory.ts`
- `lib/supabase/*`
- `.env.example`

Нельзя менять:

- UI-страницы;
- dashboard components;
- AI prompt/client files;
- auth flow, кроме согласованной таблицы `app_users`.

### `feature/auth-api`

Можно менять:

- `app/login/page.tsx`
- `app/api/auth/*`
- `lib/auth/*`
- middleware/proxy для защиты routes;
- auth UI components.

Нельзя менять:

- Supabase schema, кроме использования `app_users`;
- AI engine;
- dashboard layout;
- SKU UI.

### `feature/ai-engine`

Можно менять:

- `app/api/ai/*`
- `lib/ai/*`
- `types/ai.ts`
- Zod/JSON schema;
- AI save/read helpers.

Нельзя менять:

- основные UI-страницы, кроме минимального debug usage при необходимости;
- Supabase schema без согласования;
- auth flow.

### `feature/ui-dashboard`

Можно менять:

- `app/page.tsx`
- `app/sku/page.tsx`
- `app/sku/[id]/page.tsx`
- `app/methodology/page.tsx`
- `components/dashboard/*`
- `components/sku/*`
- `components/charts/*`
- `components/ui/*`

Нельзя менять:

- API logic;
- migrations;
- auth logic;
- OpenRouter client.

### `feature/docs`

Можно менять:

- `README.md`
- `PROMPTS.md`
- `PROJECT_PLAN.md`
- demo notes;
- screenshots, если появятся.

Нельзя менять:

- production code;
- migrations;
- env logic.

---

## 15.4. Контроль перед merge

В каждой worktree-папке после завершения работы:

```powershell
git status
git diff --stat
git diff --name-only
```

Проверяем:

1. Изменены только разрешённые файлы.
2. Нет случайных изменений lock-файлов без необходимости.
3. Нет секретов в коде.
4. Нет API keys в коммитах.
5. Нет временных debug-файлов.
6. Проект не ссылается на несуществующие env variables.
7. TypeScript-типы согласованы с API-контрактами.

Если агент изменил чужие файлы, варианты:

```powershell
git restore path\to\wrong-file
```

или вручную перенести полезный фрагмент в правильную ветку.

---

## 15.5. Коммиты в рабочих ветках

После проверки:

```powershell
git add .
git commit -m "<commit message>"
git push -u origin <branch-name>
```

---

## 15.6. Merge strategy

### GitHub Pull Request

1. Открыть GitHub.
2. Создать Pull Request из рабочей ветки в `feature/mvp`.
3. Проверить changed files.
4. Проверить, что нет секретов.
5. Merge в `feature/mvp`.
6. В основном worktree выполнить:

```powershell
git checkout feature/mvp
git pull
npm install
npm run lint
npm run build
```

Если возникает конфликт:

1. Не принимать автоматически весь файл.
2. Открыть конфликт в Cursor.
3. Сохранить API/types contracts.
4. Сначала восстановить build.
5. Потом улучшать UI.

---

## 15.7. Рекомендуемый порядок интеграции

1. `feature/db-supabase`
2. `feature/auth-api`
3. `feature/ai-engine`
4. `feature/ui-dashboard`
5. `feature/docs`

Причина: UI должен опираться на готовые контракты данных и API.

---

## 16. План этапов

## Этап 0. Зафиксировать план

Результат:

- согласован `PROJECT_PLAN.md`;
- создан или обновлён `PROMPTS.md`;
- есть первый docs-коммит.

Задачи:

1. Сохранить этот файл как `PROJECT_PLAN.md` в корень репозитория.
2. Создать `PROMPTS.md` в согласованном формате.
3. Сделать коммит.

---

## Этап 1. Инициализация Next.js

Результат:

- Next.js App Router запускается локально;
- TypeScript/Tailwind готовы;
- структура проекта создана;
- `.env.example` добавлен.

Задачи:

1. Создать Next.js app.
2. Настроить директории.
3. Добавить базовые компоненты UI.
4. Добавить Recharts.
5. Добавить Supabase/OpenAI-compatible dependencies.
6. Проверить `npm run dev`.
7. Проверить `npm run build`.

---

## Этап 2. Supabase schema и demo data

Результат:

- есть SQL schema;
- есть seed/demo dataset;
- данные загружены в Supabase cloud;
- приложение может читать SKU и движения через API.

Задачи:

1. Создать таблицы.
2. Создать demo user.
3. Создать 15–25 SKU.
4. Создать 18 месяцев истории движения.
5. Создать партии и сроки годности.
6. Подготовить начальные AI forecast rows или batch generation.
7. Добавить SQL в репозиторий.
8. Выполнить SQL в Supabase cloud.

---

## Этап 3. Auth

Результат:

- есть `/login`;
- после входа пользователь попадает на `/`;
- защищённые страницы недоступны без cookie;
- logout работает.

Задачи:

1. Реализовать login page.
2. Реализовать login/logout/me endpoints.
3. Реализовать password hash compare.
4. Реализовать signed cookie.
5. Защитить страницы.
6. Проверить вручную.

---

## Этап 4. Data API

Результат:

- UI получает данные только через Next.js API;
- Supabase service key не попадает в браузер;
- есть dashboard, SKU list, SKU detail endpoints.

Задачи:

1. Реализовать Supabase server client.
2. Реализовать `GET /api/dashboard`.
3. Реализовать `GET /api/sku`.
4. Реализовать `GET /api/sku/[id]`.
5. Добавить basic error handling.

---

## Этап 5. AI forecast engine

Результат:

- endpoint реально вызывает OpenRouter;
- ответ модели приходит в structured JSON;
- результат валидируется и сохраняется в Supabase;
- есть кэш последнего AI-прогноза.

Задачи:

1. Реализовать OpenRouter client.
2. Описать AI JSON schema.
3. Описать Zod validation.
4. Реализовать `POST /api/ai/forecast/[skuId]`.
5. Реализовать `POST /api/ai/forecast/batch`.
6. Реализовать защиту от лишних повторных вызовов.
7. Реализовать сохранение в `ai_forecasts`.
8. Проверить на 1–2 SKU.
9. Прогнать batch для demo-ключевых SKU.

---

## Этап 6. UI dashboard/catalog/detail

Результат:

- приложение выглядит как законченный продукт;
- видны все требования задания;
- карточка SKU показывает AI-анализ.

Задачи:

1. Собрать dashboard.
2. Собрать SKU catalog.
3. Собрать SKU detail.
4. Добавить Recharts-графики.
5. Добавить AI alerts.
6. Добавить кнопку пересчёта AI-прогноза.
7. Добавить loading/error states.

---

## Этап 7. Methodology и документация

Результат:

- `/methodology` объясняет подход;
- README готов;
- PROMPTS.md ведётся;
- ограничения MVP описаны честно.

Задачи:

1. Написать methodology page.
2. Написать README.
3. Обновить PROMPTS.md.
4. Добавить архитектурную схему текстом.
5. Добавить инструкцию запуска.
6. Добавить env-инструкцию.

---

## Этап 8. Деплой

Результат:

- Vercel production URL работает;
- Supabase env variables настроены;
- OpenRouter env variables настроены;
- README содержит ссылки.

Задачи:

1. Запушить `feature/mvp`.
2. Подключить GitHub repo к Vercel.
3. Настроить environment variables.
4. Запустить production deploy.
5. Проверить `/login`.
6. Проверить `/`.
7. Проверить `/sku`.
8. Проверить `/sku/[id]`.
9. Проверить `/methodology`.
10. Проверить AI recalculation на одном SKU.
11. Добавить production URL в README.
12. Merge в `main`.

---

## 17. Чеклист покрытия требований

| Требование | Где закрываем |
|---|---|
| Каталог SKU | `/sku`, `sku_items` |
| Препарат, форма выпуска, срок годности, условия хранения, текущий остаток | `sku_items`, `/sku`, `/sku/[id]` |
| История движения | `inventory_movements`, карточка SKU, графики |
| Приход, расход, списания | `inventory_movements` |
| AI-прогноз 1/3/6 месяцев | OpenRouter endpoint + `ai_forecasts` + UI |
| Сезонность и тренды | AI analysis schema + methodology |
| Аномалии | AI anomaly detection + demo movement flags |
| ROP | AI output `reorder.rop` |
| EOQ | AI output `reorder.eoq` |
| Объяснение параметров ROP/EOQ | AI explanation block |
| AI-алерты | `risks` + `recommendations` в AI output |
| Раннее предупреждение о дефиците | stockout risk + daysToStockout |
| Риск затоваривания | overstock risk + daysCoverage |
| Рекомендации: перезаказать / ускорить реализацию / списать | AI recommendations |
| ABC-анализ | dashboard + catalog |
| Дни покрытия | dashboard + catalog + карточка |
| Forecast vs fact | dashboard + карточка SKU |
| Supabase demo data | SQL files + cloud Supabase |
| README.md | корень репозитория |
| PROMPTS.md | корень репозитория |
| Деплой | Vercel URL |

---

## 18. Ограничения MVP

Честно указываем в README:

- данные синтетические;
- авторизация демонстрационная, без регистрации и ролей;
- интеграции с ERP/WMS/MES не реализованы;
- локальный Supabase через Docker не используется;
- AI-прогноз зависит от качества промпта и синтетического контекста;
- кэширование AI-результатов используется для экономии бюджета и ускорения UI;
- расчёты и рекомендации требуют бизнес-валидации перед промышленным применением;
- приложение показывает подход и продуктовую ценность, а не готовую промышленную систему планирования закупок.

---

## 19. Основные риски и решения

### Риск 1. Потратить время на сложную БД

Решение: простая Supabase schema, SQL seed, без ORM на MVP.

### Риск 2. AI ответит невалидным JSON

Решение: structured JSON, Zod validation, retry один раз, сохранение ошибок в `ai_forecast_runs`.

### Риск 3. Бюджет OpenRouter закончится

Решение: недорогая модель по умолчанию, batch limit, кэш по `input_hash`, отсутствие AI-вызовов на каждый page render.

### Риск 4. Конфликты при параллельной работе

Решение: worktree-разделение по файлам, проверка `git diff --stat`, merge по очереди, build после каждого merge.

### Риск 5. Не успеть сделать красиво

Решение: сначала dashboard + SKU detail, потом catalog filters, затем polish.

---

## 20. Формат PROMPTS.md

Промпты не включаем в `PROJECT_PLAN.md`.

`PROMPTS.md` ведём отдельно в формате:

```md
# История промптов AIForecast

В этом файле сохраняются промпты, использованные при создании проекта AIForecast.

## AI Instructions
инструкции проекта

## Prompt 1 — Заголовок на русском
текст промта

## Prompt 2 — Заголовок на русском
текст промта
```

Правила:

1. Записываем только все промпты, которые реально повлияли на проект.
2. После каждого этапа добавляем использованные промпты.
3. Не засоряем файл мелкими техническими переписками, если они не важны для отчёта.
4. Каждый prompt должен иметь понятный title/description.
5. После обновления `PROMPTS.md` делаем коммит вместе с результатом этапа.

---

## 21. Напоминание по коммитам и истории промптов

После каждого этапа:

1. Проверить `git status`.
2. Проверить, что нет секретов.
3. Обновить `PROMPTS.md`.
4. Сделать коммит с понятным message.
5. Убедиться, что приложение собирается.
