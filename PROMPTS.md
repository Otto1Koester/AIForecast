# История промптов AIForecast

В этом файле сохраняются промпты, использованные при создании проекта AIForecast.

## AI Instructions
````text
Наша задача: сделать тестовое задание по разработке web-приложения AIForecast с помощью вайбкодинга, начиная от идеи и заканчивая деплоем. Описание тестового задания ты найдешь в источниках TASK_DESCRIPTION.md - там указаны все требования. Приложение должно представлять собой MVP-версию с тестовыми данными для последующего демо на собеседовании.

В источниках у нас указан файл ENVIROMENT.md, в котором перечислены все инструменты и их версии, которые используются на компьютере для разработки. Если потребуются другие, ты можешь предложить добавить, удалить или изменить существующие.

Для разработки мы будем использовать Cursor IDE, с платным аккаунтом Team на 20$. Также у нас установлены в Cursor расширения: Codex – OpenAI’s coding agent openai с подпиской Business, Claude Code for VS Code Anthropic с подпиской Team. Старайся в планировании учитывать лимиты тарифных планов, чтобы нам хватило их на разработку всего проекта тестового задания.

Ты выступаешь в качестве руководителя разработки. Твои обязанности:
- Прорабатывать бизнес логику в соответствии с поставленной задачей.
- Определять последовательность шагов, необходимую для реализации тестового задания в указанный срок.
- Определять функции, закладываемые в приложение, количество страниц и элементов на них.
- Определять список необходимых к выполнению задач и их последовательность.
- Готовить задачи в виде промптов для нейросетей.
- Распределять задачи между Claude, Codex и Cursor, учитывая возможности нейросетей.
- Оптимизировать работу так, чтобы экономить время разработки и распараллеливать задачи там, где это возможно.

Я обладаю поверхностными техническими знаниями, потому старайся выдавать мне максимально понятные инструкции в ходе работы над проектом. Ориентируйся на указанные версии программного обеспечения.

Ты можешь разбивать свои ответы на несколько частей, если информации много. Ты можешь задавать мне уточняющие вопросы для достижения цели. Ты можешь предлагать несколько вариантов решения, описывать их преимущества и недостатки, предлагать путь, по которому будем двигаться. Твоя задача при описании конфигурации ничего не додумывать, а опираться на запрошенную документацию из интернета. Если ты строишь какое-то предположение, ты должен явно указывать об этом в тексте.

После каждого этапа напоминай мне сделать коммит и предлагай message для него. Также напоминай мне не забывать вести историю промтов для отчета в соответствии с тестовым заданием.

Коммитить нужно чаще, чем крупными этапами, чтобы избежать лишних конфликтов при merge. Напоминать о коммите нужно после логически завершённых небольших изменений, а не только после больших этапов.

Ты можешь спорить со мной и направлять меня в соответствии с твоими решениями, если ты считаешь, что они лучше, чем те подходы, которые я предлагаю. После обсуждения принятых решений / плана работы, фиксируй принятые решения и действуй в дальнейшем в соответствии с ними.

В дальнейшей работе следуй по утвержденному плану из источников PROJECT_PLAN.md, но в случае, если ты поймешь, что требуется отойти от плана, предложи свои размышления на этот счет. Мы их обсудим и скорректируем план, если они будут целесообразны.

Выдавай мне руководства к дальнейшему действию по разработке проекта и инструкции для нейросетей последовательно, шаг за шагом. Следи за оформлением промтов, конфигов и кода.
````

## Prompt 1 — Обсуждение плана действий и фиксация в Markdown
````text
На первом этапе я предлагаю обсудить план действий и зафиксировать его в источниках в виде .md. Прочитай инструкции проекта, прочитай источники и предложи свой план, чтобы мы могли его обсудить.
````

## Prompt 2 — Корректировка архитектуры: auth, Supabase, OpenRouter и Next.js full-stack
````text
Предложения от меня:
- Мы сделаем простую страницу авторизации без регистрации, а пользователь будет храниться в базе и он будет один name password hash, после которой попадаем на домашнюю страницу. 
- Мы подключаем БД Supabase для хранения демонстрационных данных.
- Мы не делаем сложный импорт из ERP/WMS, но мы храним тестовый набор данных в БД, а не коде. 
- Мы не строим тяжёлую ML-инфраструктуру, однако мы все равно делаем AI-прогнозирование в соответствии с заданием.
- Расчёты делаем на основе реального анализа AI а не детерминированного расчета, исходя из параметров SKU.
- AI реально делает анализ и у нас есть API-ключ на 10$ от сервиса openrouter.ai для демонстрации.

Основной стек

- Next.js App Router
- React
- TypeScript
- Tailwind CSS 
- Backend API Next.js Route Handlers внутри `/app/api`
- Supabase
- Recharts для графиков
- OpenRouterAI
- Vercel для деплоя
- GitHub как основной репозиторий
Мы выбираем не отдельный backend на FastAPI или Node.js, а **Next.js full-stack подход**.
Мы НЕ делаем отдельный backend-сервис на Express, Fastify или FastAPI.

Вместо этого backend будет находиться внутри Next.js в папке:

```text
app/api/
```
Наша цель на демо показать возможности AI прогнозирования, а не просто задеплоенные страницы с детерминированными расчетами. Внимательно проанализируй еще раз в описании тестового задания из источников раздел "Требования к AI", и скорректируй план. Не включай в план начальные промты.

Cursor у нас - это не только IDE, но еще и купленный тарифный план на 20$, так что мы ему также можем поручать работу. 

Также в своем плане учти, что в целях ускорения работы ты можешь дать инструкции параллельно нескольким агентам в разных ветках с использованием git tree, и последующим merge request, но при этом явно и подробно опиши шаги взаимодействия с git и cursor при таком сценарии.

Что скажешь на мои предложения?
````

## Prompt 3 — Финальные правки плана и подтверждение ключевых решений
````text
локальный Supabase через Docker не используем
Убери риск 3 - это лишняя работа, будем надеяться, что API будет работать
В 18 пункте история промтов ведется по формату:
# История промптов AIForecast

В этом файле сохраняются важные промпты, использованные при создании проекта AIForecast.
 

## Prompt 1 — Title/Description
текст промта

## Prompt 2— Title/Description
текст промта

Решения, которые нужно подтвердить перед началом кода:

Принимаем стек: Next.js App Router, React, TypeScript, Tailwind, Recharts, Supabase, OpenRouter, Vercel. - да
Авторизация: простая, без регистрации, один пользователь в Supabase с password hash. - да
Данные: синтетические, но хранятся в Supabase, не в TypeScript-коде. - да
Backend: только Next.js Route Handlers в app/api/. - да
AI: реальный OpenRouter-вызов, structured JSON, кэширование результата в Supabase. - да
UI: /login, /, /sku, /sku/[id], /methodology. - да
Параллельная работа: используем git worktree, готовы аккуратно соблюдать границы файлов, одна ответственность за отсутствие пересечений и соблюдении границ на тебе.
В PROJECT_PLAN.md не включаем начальные промпты; промпты ведём отдельно в PROMPTS.md. - да

Рассмотри мои предложения выше, если ок, то жду от тебя окончательный откоректированый .md который я добавлю в источники.
````

## Prompt 4 — Правила дальнейшей разработки и создание стартового PROMPTS.md
````text
Я обновила инструкции проекта, а также обновила файлы источников, я добавила в источники утвержденный план. В плане я убрала предложенные коммиты после этапов, так как большие пулреквесты в итоге получаются, и коммитить нужно чаще, чем предлагалось, чтобы избежать лишних конфликтов при мердже.

Далее, выдавай мне руководства к дальнейшему действию по разработке проекта и инструкции для нейросетей последовательно, шаг за шагом. Следи за оформлением промтов, конфигов и кода. Зафиксируй это себе в памяти.

Еще сформируй начальный PROMPTS.md в соответствии с нашим форматом. Первым пунктом укажи Instructions. Далее пробегись по этому чату и включи туда все мои сообщения в качестве промтов по порядку, придумай для них title.
````

## Prompt 5 — Пересборка PROMPTS.md после обновления источников
````text
Просмотри новые инструкции проекта и файл источников PROJECT_PLAN.md и пересобери PROMPTS.md в соответствии с форматом.
````

## Prompt 6 — Старт разработки: инициализация Next.js и каркаса MVP
````text
Коммит сделан, документы залиты на гитхаб. Давай начнем работу по нашему плану.
````

## Prompt 7 — Cursor Agent: создание базового каркаса Next.js проекта
````text
Ты работаешь в проекте AIForecast.

Контекст:
- Это MVP веб-сервиса для AI-прогнозирования запасов лекарственных средств.
- Следуй PROJECT_PLAN.md.
- Стек уже утверждён: Next.js App Router, React, TypeScript, Tailwind CSS, Recharts, Supabase, OpenRouter, Vercel.
- Backend должен быть только через Next.js Route Handlers внутри app/api/.
- Отдельный backend на Express/FastAPI/Nest/Fastify не создавать.
- Supabase используем cloud, локальный Supabase через Docker не используем.
- Сейчас выполняем только Этап 1: базовый каркас проекта.

Задача:
1. Проверь, что проект создан как Next.js App Router без src directory.
2. Приведи структуру проекта к PROJECT_PLAN.md.
3. Создай пустые или минимальные placeholder-страницы:
   - app/login/page.tsx
   - app/page.tsx
   - app/sku/page.tsx
   - app/sku/[id]/page.tsx
   - app/methodology/page.tsx
4. Создай директории:
   - components/auth
   - components/dashboard
   - components/sku
   - components/charts
   - components/ui
   - lib/auth
   - lib/supabase
   - lib/ai
   - lib/dashboard
   - lib/utils
   - types
   - supabase/migrations
5. Создай файлы:
   - types/inventory.ts
   - types/ai.ts
   - .env.example
6. В .env.example добавь строго такие переменные:
   NEXT_PUBLIC_SUPABASE_URL=
   SUPABASE_SERVICE_ROLE_KEY=
   JWT_SECRET=
   OPENROUTER_API_KEY=
   OPENROUTER_MODEL=openai/gpt-4o-mini
   OPENROUTER_SITE_URL=http://localhost:3000
   OPENROUTER_APP_TITLE=AIForecast
   AI_BATCH_LIMIT=5
7. Обнови metadata в app/layout.tsx:
   title: AIForecast
   description: AI-прогнозирование запасов лекарственных средств
8. Сделай минимальный визуальный shell:
   - нейтральный layout;
   - ссылки на Dashboard, SKU, Methodology;
   - без реальной бизнес-логики;
   - без обращения к Supabase/OpenRouter на этом этапе.
9. Убедись, что npm run build проходит.

Ограничения:
- Не меняй PROJECT_PLAN.md.
- Не меняй PROMPTS.md на этом шаге.
- Не добавляй реальные API ключи.
- Не создавай .env.local.
- Не создавай отдельный backend.
- Не добавляй ORM.
- Не добавляй Supabase local config.
- Не добавляй Docker для Supabase.
- Не реализуй auth, database schema или AI endpoint сейчас — это следующие этапы.
- Если create-next-app создал AGENTS.md или CLAUDE.md, можно оставить, но не пиши туда противоречивые инструкции.

После завершения покажи:
- список созданных/изменённых файлов;
- команды, которые нужно запустить;
- есть ли ошибки build/lint.
````

## Prompt 8 — Замечания к базовому shell и переход к Supabase schema
````text
Ответ от курсора:

Готово. Этап 1 закрыт: проект уже был создан как Next.js App Router без src/, я только привёл структуру к PROJECT_PLAN.md и сделал минимальный визуальный shell.

Созданные файлы
Страницы (App Router):

app/page.tsx — переписан, нейтральный дашборд-плейсхолдер с KPI-плитками.
app/login/page.tsx — placeholder с задизейбленной формой username/password.
app/sku/page.tsx — placeholder каталога SKU.
app/sku/[id]/page.tsx — placeholder карточки SKU (params: Promise<{ id: string }>, как в Next.js 16).
app/methodology/page.tsx — placeholder методологии.
Типы:

types/inventory.ts — SkuItem, InventoryLot, InventoryMovement, AppUser, StorageCondition, AbcClass.
types/ai.ts — AiForecastAnalysis и связанные типы по схеме из §11 плана + AiForecastRecord, AiForecastRun.
Конфиг:

.env.example — строго 8 переменных из ТЗ.
.gitignore — добавлено исключение !.env.example (иначе он попадал под .env*).
Директории (с .gitkeep, чтобы git их видел):

components/auth, components/dashboard, components/sku, components/charts, components/ui
lib/auth, lib/supabase, lib/ai, lib/dashboard, lib/utils
supabase/migrations
Изменённые файлы
app/layout.tsx — обновлён metadata (title: "AIForecast", description: "AI-прогнозирование запасов лекарственных средств"), lang="ru", добавлен общий shell: header с логотипом, навигацией Dashboard / SKU / Methodology, кнопкой «Войти», main и footer. Tailwind, без обращения к Supabase/OpenRouter.
.gitignore — добавлен !.env.example.
Что НЕ менялось
PROJECT_PLAN.md, PROMPTS.md — не трогал.
package.json — все нужные зависимости (next, react, tailwindcss, recharts, @supabase/supabase-js, openai, zod, bcryptjs, jose) уже стояли, ничего не доставлял.
AGENTS.md / CLAUDE.md — оставил как есть, без противоречивых инструкций.
Никаких реальных API-ключей, .env.local, отдельного backend, ORM, локального Supabase, Docker для Supabase, auth/AI/DB-логики не добавлял — это следующие этапы.
Команды для запуска
npm install
npm run dev
npm run build
npm run lint
(Перед npm run dev — скопировать .env.example в .env.local и заполнить значения; на этом этапе они ещё не используются в коде.)

Build / Lint статус
npm run build — успешно: Next.js 16.2.4, скомпилировано за ~5.8s, статически сгенерированы маршруты /, /login, /methodology, /sku, и динамический /sku/[id]. Ошибок нет.
npm run lint — успешно, без сообщений.
ReadLints по app/ и types/ — без диагностик.

Всё работает и закоммитано, как ты написал в инструкции. Однако, стартовая страница сейчас не login, а дашборд. При этом с точки зрения UI вверху указана вкладка dashboard, которой не должно быть, т.к. переход на страницу дашборд должен осуществляться через надпись сервиса AIForecast. Также не должно быть кнопки вход - форма авторизации должна появляться сразу при заходе на сервис, если пользователь не авторизован. При этом если пользователь авторизован, то форма логина не должна появляться, а вместо кнопки войти, должна быть кнопка выйти, которая ведет на страницу авторизации. Просмотри скриншот и учти текущее состояние проекта при дальнейшем планировании шагов.

Если у тебя нет замечаний по этому этапу, то можем переходить к следующему.
````

## Prompt 9 — Codex: Supabase schema и synthetic demo data
````text
Ты работаешь в проекте AIForecast, branch feature/db-supabase, worktree AIForecast-db-supabase.

Контекст проекта:
- Это MVP веб-сервиса для AI-прогнозирования запасов лекарственных средств.
- Следуй PROJECT_PLAN.md.
- Стек: Next.js App Router, React, TypeScript, Tailwind CSS, Recharts, Supabase, OpenRouter, Vercel.
- Backend будет только через Next.js Route Handlers внутри app/api/.
- Supabase используем только cloud.
- Локальный Supabase через Docker не используем.
- Demo data должны храниться в Supabase, а не в TypeScript-коде.
- Сейчас выполняется только Этап 2: Supabase schema и demo data.

Разрешено менять только:
- supabase/migrations/*
- supabase/seed.sql
- lib/supabase/*
- types/inventory.ts
- .env.example только если там явно не хватает переменной из PROJECT_PLAN.md

Запрещено менять:
- app/page.tsx
- app/layout.tsx
- app/login/page.tsx
- app/sku/*
- app/methodology/*
- components/*
- app/api/auth/*
- app/api/ai/*
- lib/auth/*
- lib/ai/*
- PROJECT_PLAN.md
- PROMPTS.md
- README.md
- package.json, если нет крайней необходимости
- package-lock.json, если package.json не менялся

Задача 1. Создай migration:
Файл:
supabase/migrations/001_init_schema.sql

В migration создай таблицы:

1. app_users
Поля:
- id uuid primary key default gen_random_uuid()
- username text unique not null
- password_hash text not null
- display_name text
- created_at timestamptz default now()

2. sku_items
Поля:
- id uuid primary key default gen_random_uuid()
- name text not null
- dosage_form text not null
- category text not null
- storage_condition text not null
- shelf_life_days int not null
- current_stock numeric not null
- unit text not null
- unit_cost numeric not null
- order_cost numeric not null
- holding_cost_rate numeric not null
- lead_time_days int not null
- service_level numeric not null
- supplier text not null
- created_at timestamptz default now()

3. inventory_lots
Поля:
- id uuid primary key default gen_random_uuid()
- sku_id uuid not null references sku_items(id) on delete cascade
- lot_number text not null
- quantity numeric not null
- received_at date not null
- expires_at date not null
- created_at timestamptz default now()

4. inventory_movements
Поля:
- id uuid primary key default gen_random_uuid()
- sku_id uuid not null references sku_items(id) on delete cascade
- period_month date not null
- inbound_qty numeric not null
- outbound_qty numeric not null
- writeoff_qty numeric not null
- ending_stock numeric not null
- anomaly_flag boolean default false
- anomaly_note text
- created_at timestamptz default now()

5. ai_forecasts
Поля:
- id uuid primary key default gen_random_uuid()
- sku_id uuid not null references sku_items(id) on delete cascade
- model text not null
- input_hash text not null
- forecast_1m numeric not null
- forecast_3m numeric not null
- forecast_6m numeric not null
- rop numeric not null
- eoq numeric not null
- stockout_risk text not null
- overstock_risk text not null
- expiry_risk text not null
- confidence numeric
- analysis jsonb not null
- raw_response jsonb
- created_at timestamptz default now()

6. ai_forecast_runs
Поля:
- id uuid primary key default gen_random_uuid()
- sku_id uuid references sku_items(id) on delete cascade
- status text not null
- model text not null
- input_hash text
- error_message text
- created_at timestamptz default now()
- finished_at timestamptz

Требования к migration:
- Используй public schema.
- Используй create table if not exists.
- Добавь разумные check constraints:
  - quantities >= 0
  - costs >= 0
  - shelf_life_days > 0
  - lead_time_days > 0
  - service_level between 0 and 1
  - risk values in ('low', 'medium', 'high', 'critical')
  - confidence between 0 and 1
- Добавь unique constraint для inventory_movements на (sku_id, period_month).
- Добавь индексы:
  - inventory_lots(sku_id)
  - inventory_lots(expires_at)
  - inventory_movements(sku_id, period_month)
  - ai_forecasts(sku_id, created_at desc)
  - ai_forecast_runs(sku_id, created_at desc)
- Включи RLS для всех таблиц, но не создавай public policies. Мы будем читать данные только server-side через service role key.
- Не добавляй Supabase Auth.
- Не добавляй ORM.
- Не добавляй локальный Supabase config.
- Не добавляй Docker.

Задача 2. Создай seed:
Файл:
supabase/seed.sql

Seed должен быть повторно запускаемым.
В начале seed очисти таблицы в безопасном порядке:
- ai_forecast_runs
- ai_forecasts
- inventory_movements
- inventory_lots
- sku_items
- app_users

Добавь demo user:
- username: demo
- password для демонстрации: demo12345
- в таблицу сохраняй только bcrypt hash, не plain password
- display_name: Demo User

Сгенерируй bcrypt hash локально через bcryptjs и вставь статический hash в seed.sql.

Добавь 20 SKU для фармацевтической компании.
Каждый SKU должен иметь реалистичные значения:
- препарат
- форма выпуска
- категория
- условия хранения
- shelf_life_days
- current_stock
- unit
- unit_cost
- order_cost
- holding_cost_rate
- lead_time_days
- service_level
- supplier

Обязательные demo-сценарии:
1. Быстро оборачиваемый SKU с риском дефицита.
2. Медленно оборачиваемый SKU с риском затоваривания.
3. SKU с зимней сезонностью.
4. SKU с летним сезонным спросом.
5. SKU с аномальным списанием.
6. Дорогой SKU класса A.
7. SKU класса C, занимающий складское место.
8. SKU с коротким остаточным сроком годности.
9. SKU с длинным lead time поставщика.
10. SKU, у которого факт резко разошёлся с будущим forecast-контекстом.

Добавь inventory_lots:
- 2–4 партии на ключевых SKU
- lot_number
- quantity
- received_at
- expires_at
- обязательно должны быть партии:
  - с близким сроком годности
  - с нормальным сроком годности
  - с большим остаточным сроком

Добавь inventory_movements:
- 18 месяцев истории
- период: с 2024-10-01 по 2026-03-01 включительно
- для каждого SKU должен быть один row на каждый месяц
- inbound_qty, outbound_qty, writeoff_qty, ending_stock
- для сезонных SKU сделай понятную сезонность
- для 2–3 SKU добавь anomaly_flag = true и anomaly_note
- данные должны выглядеть реалистично и разнообразно

Важно:
- Не добавляй fake ai_forecasts на этом этапе.
- Таблица ai_forecasts должна остаться пустой: реальные записи появятся после OpenRouter batch generation на этапе AI.
- Не добавляй demo data в TypeScript.
- Не добавляй JSON-файлы с demo data.

Задача 3. Создай server-side Supabase client:
Файл:
lib/supabase/server.ts

Требования:
- импортируй createClient из @supabase/supabase-js
- экспортируй функцию createSupabaseAdminClient()
- используй process.env.NEXT_PUBLIC_SUPABASE_URL
- используй process.env.SUPABASE_SERVICE_ROLE_KEY
- если env отсутствуют, бросай понятную ошибку
- не создавай client на top-level, чтобы build не падал без env
- не используй service role key в клиентских компонентах
- добавь комментарий, что этот helper только для server-side Route Handlers

Задача 4. Проверь types/inventory.ts:
- Убедись, что типы согласованы с SQL schema.
- Не ломай уже существующие типы.
- Добавь недостающие типы только если нужно.

Задача 5. Проверка качества:
- Запусти npm run lint.
- Запусти npm run build.
- Покажи список созданных и изменённых файлов.
- Покажи git diff --stat.
- Убедись, что нет секретов и нет .env.local в git.

Acceptance criteria:
- migration и seed можно выполнить в Supabase SQL Editor.
- После seed должно быть:
  - 1 app user
  - 20 sku_items
  - минимум 40 inventory_lots
  - ровно 360 inventory_movements
  - 0 ai_forecasts
- npm run lint проходит.
- npm run build проходит.
````