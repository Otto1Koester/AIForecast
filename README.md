# AIForecast — AI-прогнозирование запасов лекарственных средств

## Краткое описание

AIForecast — MVP веб-сервиса для фармацевтической компании полного цикла. Приложение помогает закупщику и команде supply chain видеть текущее состояние запасов, прогнозировать потребность и заранее замечать риски, которые в реальном бизнесе приводят к дефициту, затовариванию и списаниям.

Сервис демонстрирует полный flow: demo-авторизация, dashboard, каталог SKU, карточка SKU, ручной AI-пересчёт прогноза и страница методологии. AI используется как forecast/decision engine: он анализирует контекст SKU, возвращает прогноз на 1/3/6 месяцев, ROP/EOQ, риски и рекомендации по действиям.

Приложение помогает:

- прогнозировать потребность;
- выявлять риски дефицита;
- выявлять риски затоваривания;
- учитывать сроки годности и риск списания;
- рассчитывать ROP/EOQ;
- получать AI-рекомендации: перезаказать, ускорить реализацию, списать, мониторить или скорректировать safety stock.

## Ссылки

- GitHub repository: https://github.com/Otto1Koester/AIForecast
- Production URL: `TBD после Vercel deploy`
- Demo login:
  - username: `demo`
  - password: `demo12345`

## Основные возможности

- Простая demo-авторизация без регистрации.
- Защищённые страницы через session cookie.
- Dashboard с KPI, AI-алертами, ABC-анализом, днями покрытия, forecast vs fact, AI status и top risk SKU.
- SKU catalog с поиском, фильтрами, сортировкой, сводными метриками, ROP/EOQ и AI-рекомендациями.
- SKU detail с паспортом позиции, партиями, сроками годности, историей движения, графиками, AI-прогнозом, рисками и рекомендациями.
- Methodology page, которая объясняет data flow, AI-подход, forecast horizons, ROP/EOQ, риски, ограничения MVP и дальнейшее развитие.
- Supabase demo data: SKU, партии, движения, demo user и таблицы для AI-прогнозов.
- Data API внутри Next.js Route Handlers.
- OpenRouter AI forecast через server-side endpoint.
- AI forecast caching в Supabase по `input_hash`.
- Ручной пересчёт AI-прогноза на карточке SKU.

## Стек

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Recharts
- Supabase Cloud Postgres
- OpenRouter API
- Vercel
- GitHub

## Архитектура

```text
User
→ Next.js App Router UI
→ Next.js Route Handlers in app/api
→ Supabase Cloud Postgres
→ OpenRouter AI
→ ai_forecasts / ai_forecast_runs
→ Dashboard / Catalog / SKU Detail
```

Отдельного backend-сервиса нет: backend живёт внутри `app/api` как Next.js Route Handlers. UI не обращается напрямую к Supabase или OpenRouter, а получает данные через внутренние API endpoints.

`SUPABASE_SERVICE_ROLE_KEY` используется только server-side. `OPENROUTER_API_KEY` также используется только на сервере. Client components не получают секреты и работают только с DTO, которые возвращают Route Handlers.

## Страницы приложения

### `/login` — demo auth

Страница входа показывает форму `username/password` и пускает в приложение demo-пользователя. Если пользователь уже авторизован, он перенаправляется на dashboard. Регистрации и production-grade ролей в MVP нет.

### `/` — dashboard

Dashboard даёт обзор состояния запасов: KPI, AI-алерты, ABC-анализ, дни покрытия, forecast vs fact и top risk SKU. Экран также показывает AI status: есть ли рассчитанные прогнозы, сколько их, какая модель использовалась и есть ли failed/pending runs.

### `/sku` — catalog

Каталог SKU показывает товарные позиции, текущий остаток, стоимость запасов, дни покрытия, ABC-класс, ROP/EOQ, риски и AI-рекомендации. В интерфейсе есть поиск, фильтры по категории, условиям хранения, ABC и рискам, а также сортировка. Каждая строка ведёт в карточку конкретного SKU.

### `/sku/[id]` — detail card

Карточка SKU раскрывает паспорт позиции, партии и сроки годности, историю прихода/расхода/списаний, forecast vs fact, ROP/EOQ, риски и рекомендации. Здесь находится кнопка `Пересчитать AI-прогноз`, которая вызывает OpenRouter через server-side endpoint и после успеха обновляет сохранённый forecast в Supabase. Для демонстрации есть технический блок с моделью, run id, input hash, статусом и timestamps.

### `/methodology` — объяснение подхода

Methodology объясняет, как данные проходят через продукт: Supabase demo data → Next.js API → OpenRouter → сохранённый forecast → UI. Страница описывает входной контекст AI, прогнозирование на 1/3/6 месяцев, сезонность, тренды, аномалии, confidence, ROP/EOQ, риски, рекомендации и ограничения MVP. Это отдельный экран для интервью, чтобы быстро объяснить архитектуру и продуктовую логику.

## API endpoints

- `POST /api/auth/login` — принимает `username/password`, проверяет bcrypt hash в `app_users`, создаёт signed session cookie и возвращает пользователя без `password_hash`.
- `POST /api/auth/logout` — очищает session cookie.
- `GET /api/auth/me` — возвращает текущего пользователя или `401`.
- `GET /api/dashboard` — возвращает `DashboardResponse`: KPI, alerts, ABC, coverage, forecast vs fact, top risk SKU и AI status.
- `GET /api/sku` — возвращает `SkuListResponse`: каталог SKU с computed metrics и последними AI-forecast полями.
- `GET /api/sku/[id]` — возвращает `SkuDetailResponse`: паспорт SKU, метрики, партии, движения, forecast vs fact, reorder, risks, recommendations и AI metadata.
- `POST /api/ai/forecast/[skuId]` — собирает SKU context, вызывает OpenRouter, валидирует structured JSON, сохраняет результат в `ai_forecasts`, пишет run в `ai_forecast_runs` и возвращает новый forecast.
- `POST /api/ai/forecast/batch` — пересчитывает прогнозы пачкой для demo-подготовки; использует `AI_BATCH_LIMIT`.

## Данные и Supabase

Данные синтетические и хранятся в Supabase Cloud Postgres. Локальный Supabase через Docker не используется. SQL schema и seed лежат в репозитории: `supabase/migrations/001_init_schema.sql` и `supabase/seed.sql`.

Таблицы:

- `app_users` — demo user, username и bcrypt `password_hash`.
- `sku_items` — паспорт SKU: препарат, форма выпуска, категория, условия хранения, срок годности, текущий остаток, unit cost, order cost, holding cost, lead time, service level и поставщик.
- `inventory_lots` — партии, количество, дата прихода и срок годности.
- `inventory_movements` — история прихода, расхода, списаний, остатка на конец месяца и anomaly flags.
- `ai_forecasts` — сохранённые AI-прогнозы, ROP/EOQ, риски, confidence, full analysis JSON и raw response.
- `ai_forecast_runs` — журнал AI-запусков: pending/success/error, model, input hash, error message и timestamps.

Demo dataset закрывает разные сценарии: быстрый расход и риск дефицита, медленно оборачиваемые позиции, сезонность, аномальные пики/провалы, списания, партии с коротким сроком годности и холодовую цепь.

## AI-подход

AI является forecast/decision engine, а не декоративным генератором текста. Next.js server-side код собирает structured SKU context: паспорт SKU, текущий остаток, партии и сроки годности, 18 месяцев движения, anomaly months, lead time, service level, стоимость заказа, стоимость хранения и reference metrics.

OpenRouter получает этот structured context и должен вернуть structured JSON по ожидаемой схеме. Ответ валидируется на сервере через schema validation и guardrails: SKU id должен совпадать, forecast/ROP/EOQ/confidence должны быть числовыми и допустимыми, confidence должен быть в диапазоне 0..1. Валидный результат сохраняется в Supabase, после чего UI читает сохранённый forecast.

AI не вызывается на каждый render. Если входной контекст не изменился, используется cache по `input_hash`; принудительный пересчёт выполняется кнопкой на карточке SKU с `force: true`.

AI возвращает:

- forecast на 1/3/6 месяцев;
- сезонность;
- тренд;
- аномалии;
- ROP;
- EOQ;
- risks: stockout, overstock, expiry;
- рекомендации;
- confidence;
- executive summary.

## Environment variables

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

- `.env.local` не коммитить;
- `SUPABASE_SERVICE_ROLE_KEY` не должен попадать в browser;
- `OPENROUTER_API_KEY` не должен попадать в browser;
- `JWT_SECRET` должен оставаться server-side;
- env values нужно добавить локально в `.env.local` и в Vercel Project Settings.

## Локальный запуск

Для Windows PowerShell:

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

После копирования `.env.local` нужно заполнить Supabase, OpenRouter и JWT значения. Приложение по умолчанию запускается на `http://localhost:3000`.

## Supabase setup

1. Создать Supabase Cloud project.
2. Открыть SQL Editor.
3. Выполнить `supabase/migrations/001_init_schema.sql`.
4. Выполнить остальные актуальные migration-файлы из `supabase/migrations` по порядку, если они есть в ветке.
5. Выполнить `supabase/seed.sql`.
6. Проверить demo user и demo data.
7. Заполнить `NEXT_PUBLIC_SUPABASE_URL` и `SUPABASE_SERVICE_ROLE_KEY` в `.env.local` и Vercel.

Проверочный SQL:

```sql
select
  (select count(*) from app_users) as app_users,
  (select count(*) from sku_items) as sku_items,
  (select count(*) from inventory_lots) as inventory_lots,
  (select count(*) from inventory_movements) as inventory_movements,
  (select count(*) from ai_forecasts) as ai_forecasts,
  (select count(*) from ai_forecast_runs) as ai_forecast_runs;
```

После seed таблицы `ai_forecasts` и `ai_forecast_runs` могут быть пустыми. Они наполняются после ручного или batch AI-пересчёта.

## OpenRouter setup

- Нужен `OPENROUTER_API_KEY`.
- Модель задаётся через `OPENROUTER_MODEL`.
- По умолчанию используется `openai/gpt-4o-mini`.
- AI forecast вызывается через server-side endpoint `POST /api/ai/forecast/[skuId]`.
- Batch endpoint `POST /api/ai/forecast/batch` можно использовать для подготовки demo data.

## Демо-сценарий

1. Открыть приложение.
2. Войти как `demo / demo12345`.
3. Посмотреть Dashboard: KPI, AI-алерты, ABC, days coverage, forecast vs fact и top risks.
4. Открыть SKU catalog.
5. Применить поиск, фильтры и сортировку.
6. Открыть SKU detail.
7. Посмотреть партии, сроки годности, историю движения и forecast vs fact.
8. Нажать `Пересчитать AI-прогноз`.
9. Показать AI forecast 1/3/6, ROP/EOQ, risks, recommendations, confidence и executive summary.
10. Открыть Methodology и объяснить data flow, AI-подход, ROP/EOQ и ограничения MVP.

## Деплой на Vercel

1. Подключить GitHub repository к Vercel.
2. Выбрать проект AIForecast.
3. Добавить env variables в Vercel Project Settings.
4. Выполнить deploy.
5. Проверить `/login`, `/`, `/sku`, `/sku/[id]`, `/methodology`.
6. Проверить AI recalculation на одном SKU.
7. Заменить placeholder `TBD после Vercel deploy` в README на production URL.

## Команды качества

```powershell
npm run lint
npm run build
```

## Ограничения MVP

- Данные синтетические и нужны для демонстрации подхода.
- Auth демонстрационная: без регистрации, ролей и production-grade access model.
- ERP/WMS/MES не подключены.
- Локальный Supabase через Docker не используется.
- AI-рекомендации требуют бизнес-валидации перед production.
- Приложение демонстрирует архитектуру, продуктовый flow и AI-подход, а не промышленную ERP/S&OP-систему.

## Принятые решения

- Next.js full-stack без отдельного backend.
- Supabase Cloud Postgres для demo data и AI forecast storage.
- OpenRouter как AI provider через OpenAI-compatible client.
- Structured JSON вместо свободного текста модели.
- AI forecast caching в Supabase по `input_hash`.
- Git worktree для параллельной разработки feature-веток.
- Vercel deploy для production URL.

## Структура проекта

```text
AIForecast
├─ app/
│  ├─ (protected)/
│  ├─ api/
│  └─ login/
├─ components/
│  ├─ auth/
│  ├─ charts/
│  ├─ dashboard/
│  ├─ methodology/
│  ├─ sku/
│  └─ ui/
├─ lib/
│  ├─ ai/
│  ├─ auth/
│  ├─ dashboard/
│  ├─ sku/
│  ├─ supabase/
│  └─ utils/
├─ types/
│  ├─ ai.ts
│  ├─ api.ts
│  └─ inventory.ts
├─ supabase/
│  ├─ migrations/
│  └─ seed.sql
├─ README.md
├─ PROMPTS.md
└─ PROJECT_PLAN.md
```
