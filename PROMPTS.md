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

## Prompt 10 — Завершение Supabase schema и переход к Auth
````text
Я выполнила всё в соответствии с твоими инструкциями. Проверки прошли успешно. База создана в облаке supabase, данными заполнена .env.local заполнен в обеих ветках нужными значениями для supabase. Жду дальнейшей инструкции.
````

## Prompt 11 — Codex: demo auth, protected routes и исправление shell
````text
Ты работаешь в проекте AIForecast, branch feature/auth-api, worktree AIForecast-auth-api.

Контекст проекта:
- Это MVP веб-сервиса для AI-прогнозирования запасов лекарственных средств.
- Следуй PROJECT_PLAN.md.
- Стек: Next.js App Router, React, TypeScript, Tailwind CSS, Supabase, OpenRouter, Vercel.
- Backend только через Next.js Route Handlers внутри app/api/.
- Supabase используем cloud.
- Локальный Supabase через Docker не используем.
- Авторизация простая: без регистрации, один demo user в таблице app_users, пароль хранится как password_hash.
- Таблица app_users и server-side Supabase helper уже созданы на предыдущем этапе.
- Сейчас выполняется только Этап 3: Auth и исправление shell под авторизованный/неавторизованный режим.

Цель:
1. При первом заходе на сервис пользователь должен видеть форму логина.
2. Неавторизованный пользователь при заходе на /, /sku, /sku/[id], /methodology должен попадать на /login.
3. После успешного входа пользователь попадает на /.
4. Страница /login не должна показывать общий app header.
5. В защищённом header не должно быть отдельной вкладки Dashboard.
6. Название/логотип AIForecast должен вести на /.
7. В защищённом header должны быть только ссылки SKU и Methodology плюс кнопка Выйти.
8. Кнопка Выйти должна удалять session cookie и переводить пользователя на /login.
9. Не реализуй регистрацию.
10. Не используй Supabase Auth.

Разрешено менять:
- app/layout.tsx
- app/login/page.tsx
- app/page.tsx, app/sku/page.tsx, app/sku/[id]/page.tsx, app/methodology/page.tsx только для переноса в route group
- app/(protected)/**
- app/api/auth/**
- components/auth/**
- components/layout/** если нужно
- components/ui/** если нужен минимальный Button/Card/Input
- lib/auth/**
- proxy.ts
- types/inventory.ts только если нужен экспорт типа пользователя без password_hash

Запрещено менять:
- supabase/migrations/*
- supabase/seed.sql
- lib/supabase/server.ts, кроме критичной TypeScript-ошибки; если нужно менять, сначала объясни зачем
- lib/ai/*
- app/api/ai/*
- app/api/dashboard/*
- app/api/sku/*
- components/dashboard/*
- components/sku/*
- components/charts/*
- PROJECT_PLAN.md
- PROMPTS.md
- README.md
- package.json и package-lock.json, если нет крайней необходимости
- .env.example, если переменные уже соответствуют PROJECT_PLAN.md
- .env.local нельзя создавать в git и нельзя коммитить

Задача 1. Перестрой app layout через route groups:
- app/layout.tsx должен остаться root layout с html/body, metadata и global styles.
- Убери из app/layout.tsx общий header/nav/footer, чтобы /login был чистой страницей.
- Создай app/(protected)/layout.tsx.
- Перенеси защищённые страницы:
  - app/page.tsx → app/(protected)/page.tsx
  - app/sku/page.tsx → app/(protected)/sku/page.tsx
  - app/sku/[id]/page.tsx → app/(protected)/sku/[id]/page.tsx
  - app/methodology/page.tsx → app/(protected)/methodology/page.tsx
- URL должны остаться прежними:
  - /
  - /sku
  - /sku/[id]
  - /methodology
- Не должно остаться конфликтующих страниц, которые резолвятся в один и тот же URL.

Задача 2. Реализуй auth helpers:
Создай файлы в lib/auth:
- constants.ts
- session.ts
- current-user.ts

Требования:
- Cookie name: aiforecast_session.
- Session cookie должен быть httpOnly.
- sameSite: lax.
- path: /.
- secure: true в production, false в development.
- maxAge: 8 часов.
- Используй JWT_SECRET из process.env.JWT_SECRET.
- Используй jose для SignJWT и jwtVerify.
- Не храни password_hash в JWT.
- Payload JWT должен содержать минимум:
  - userId
  - username
  - displayName
- Если JWT_SECRET отсутствует, бросай понятную server-side ошибку.
- current-user helper должен уметь:
  - прочитать cookie через await cookies() из next/headers;
  - проверить JWT;
  - при необходимости вернуть null;
  - для protected layout предоставить requireCurrentUser(), который делает redirect('/login') при отсутствии или невалидности session.
- Не используй localStorage/sessionStorage для auth.

Задача 3. Реализуй API endpoints:
Создай:
- app/api/auth/login/route.ts
- app/api/auth/logout/route.ts
- app/api/auth/me/route.ts

POST /api/auth/login:
- принимает JSON { username, password };
- валидирует, что оба поля непустые строки;
- читает app_users через createSupabaseAdminClient();
- ищет пользователя по username;
- сравнивает password с password_hash через bcryptjs.compare;
- при ошибке возвращает 401 с нейтральным сообщением "Неверный логин или пароль";
- при успехе создаёт signed session cookie;
- возвращает JSON:
  {
    "user": {
      "id": "...",
      "username": "...",
      "displayName": "..."
    }
  }
- password_hash никогда не возвращать в response.

POST /api/auth/logout:
- очищает cookie aiforecast_session;
- возвращает { "ok": true }.

GET /api/auth/me:
- проверяет session cookie;
- если session валидна, возвращает user без password_hash;
- если session отсутствует или невалидна, возвращает 401.

В Route Handlers используй Response.json или NextResponse.json.
Не используй NextResponse.next() внутри Route Handler.

Задача 4. Реализуй Login UI:
- app/login/page.tsx должен показывать форму входа без общего app header.
- Создай components/auth/LoginForm.tsx как client component.
- Поля:
  - username
  - password
- Кнопка: Войти
- Можно показать подсказку для demo:
  - demo / demo12345
- При submit:
  - POST /api/auth/login
  - при успехе router.replace('/')
  - router.refresh()
  - при ошибке показать русское сообщение
- Если пользователь уже авторизован и открывает /login, server page должен redirect('/').

Задача 5. Реализуй protected shell:
- app/(protected)/layout.tsx должен проверять пользователя через requireCurrentUser().
- Если пользователь не авторизован, redirect('/login').
- Header:
  - слева Link "AIForecast" на /
  - в навигации только SKU и Methodology
  - не должно быть ссылки Dashboard
  - справа кнопка Выйти
- Создай components/auth/LogoutButton.tsx как client component.
- LogoutButton:
  - POST /api/auth/logout
  - router.replace('/login')
  - router.refresh()
- Можно показывать displayName рядом с кнопкой Выйти, но аккуратно.

Задача 6. Реализуй proxy.ts:
- Используй Next.js 16 file convention proxy.ts, не middleware.ts.
- proxy.ts должен делать только быстрый redirect на /login, если нет cookie aiforecast_session.
- Не импортируй Supabase, bcryptjs и тяжёлую auth-логику в proxy.ts.
- Не делай полноценную JWT-валидацию в proxy.ts.
- Matcher должен защищать:
  - /
  - /sku/:path*
  - /methodology
- /login и /api/auth/* не должны блокироваться proxy.

Задача 7. Исправь текущие placeholder pages после переноса:
- На dashboard placeholder убери текст, который говорит, что "Этап 1".
- Можно оставить нейтральный текст "Данные будут загружены из Supabase на следующих этапах".
- На всех защищённых страницах не должно быть кнопки "Войти".
- Визуально всё должно быть аккуратно и на русском.

Задача 8. Проверка:
- Запусти npm run lint.
- Запусти npm run build.
- Запусти npm run dev и проверь вручную:
  1. /login открывается без header.
  2. Неверный пароль показывает ошибку.
  3. demo / demo12345 логинит и переводит на /.
  4. На / нет вкладки Dashboard.
  5. Логотип AIForecast ведёт на /.
  6. В header есть SKU, Methodology и Выйти.
  7. /sku открывается после логина.
  8. /sku/demo открывается после логина.
  9. /methodology открывается после логина.
  10. Выйти переводит на /login.
  11. После logout прямой заход на /sku переводит на /login.
  12. GET /api/auth/me после login возвращает user, после logout возвращает 401.
- Покажи список изменённых файлов.
- Покажи git diff --stat.
- Убедись, что нет .env.local в git.
- Убедись, что нет секретов в коде.

Acceptance criteria:
- npm run lint проходит.
- npm run build проходит.
- Login flow работает через Supabase app_users и bcrypt hash.
- Session хранится в httpOnly cookie.
- Protected pages защищены.
- Header соответствует замечаниям:
  - нет Dashboard tab;
  - AIForecast ведёт на /;
  - вместо Войти есть Выйти;
  - /login без общего header.
- Не реализованы Data API и AI endpoint на этом этапе.
````

## Prompt 12 — Supabase возвращает permission denied
````text
На этом этапе кодекс ответил:

Важный блокер по реальному login: текущий cloud Supabase возвращает permission denied for table app_users при server-side запросе к app_users, поэтому demo / demo12345 сейчас получает 401 на этой машине. Ключи/хэш не выводил. Код использует createSupabaseAdminClient() и bcryptjs.compare, но нужно поправить Supabase env/grants/service role в cloud, не через запрещённые migration edits.

Возможно я не верно указала значения:

NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=

Подскажи как проверить что они правильные или нет и где искать в консоле супабейс правильные значения?
````

## Prompt 13 — Неверный ключ Supabase
````text
Этот ключ тоже не подходит, в чем может быть проблема?
````

## Prompt 14 — Изменение схемы базы данных
````text
Заработало, дай промт для кодекс на внесение изменений в схему базы данных в ветке feature/db-supabase
````

## Prompt 15 — Codex: grant service role privileges
````text
Ты работаешь в проекте AIForecast, branch feature/db-supabase.

Контекст:

* На этапе Auth реальный login через demo / demo12345 сначала падал с ошибкой: permission denied for table app_users.
* Проблема была решена вручную в Supabase Cloud через GRANT в SQL Editor.
* После GRANT login flow заработал.
* Нужно сделать это изменение воспроизводимым в репозитории через SQL migration.
* Auth-код менять не нужно.
* Seed-данные менять не нужно.
* Реальные ключи/env не добавлять.

Следуй PROJECT_PLAN.md:

* Supabase schema и SQL seed должны храниться в репозитории.
* Supabase используем cloud, локальный Supabase через Docker не используем.
* service role key используется только server-side.
* Ветка feature/db-supabase имеет право менять только DB-related файлы.

Разрешено менять только:

* supabase/migrations/*
* при крайней необходимости: supabase/seed.sql
* при крайней необходимости: types/inventory.ts
* при крайней необходимости: lib/supabase/*

Запрещено менять:

* app/**
* components/**
* lib/auth/**
* app/api/auth/**
* app/api/ai/**
* lib/ai/**
* PROJECT_PLAN.md
* PROMPTS.md
* README.md
* package.json
* package-lock.json
* .env.local
* любые файлы с секретами

Задача:

1. Создай новую migration:

supabase/migrations/002_grant_service_role_privileges.sql

2. В migration добавь SQL, который выдаёт роли service_role права на public schema, существующие tables, sequences и routines.

Содержимое migration должно быть таким:

-- Grant service_role access to public schema objects.
-- This is required because RLS bypass by service_role is not enough
-- when PostgreSQL table privileges were not granted.

grant usage on schema public to service_role;

grant all privileges on all tables in schema public to service_role;
grant all privileges on all sequences in schema public to service_role;
grant all privileges on all routines in schema public to service_role;

alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on sequences to service_role;
alter default privileges in schema public grant all on routines to service_role;

3. Не добавляй policies для anon/authenticated.
4. Не отключай RLS.
5. Не добавляй Supabase Auth.
6. Не меняй password hash.
7. Не меняй demo user.
8. Не добавляй реальные API keys.
9. Не трогай auth implementation — она уже работает после ручного GRANT.

Дополнительно:

* Проверь, что migration не содержит секретов.
* Проверь, что SQL можно выполнить повторно в Supabase SQL Editor без разрушения данных.
* Добавь в конец своего ответа проверочный SQL, который можно выполнить вручную в Supabase SQL Editor:

select
has_schema_privilege('service_role', 'public', 'usage') as service_role_has_public_usage,
has_table_privilege('service_role', 'public.app_users', 'select') as service_role_can_select_app_users,
has_table_privilege('service_role', 'public.app_users', 'insert') as service_role_can_insert_app_users,
has_table_privilege('service_role', 'public.sku_items', 'select') as service_role_can_select_sku_items,
has_table_privilege('service_role', 'public.ai_forecasts', 'insert') as service_role_can_insert_ai_forecasts;

Acceptance criteria:

* Создан файл supabase/migrations/002_grant_service_role_privileges.sql.
* Другие файлы не изменены, если не было крайней необходимости.
* git diff --name-only показывает только новую migration.
* npm run lint проходит.
* npm run build проходит.
* Login/auth код не изменён.
* Нет секретов в diff.
````

## Prompt 16 — Возврат пункта Dashboard в header
````text
Выполнила из последних инструкций все до 6 пункта. Все успешно работает. Однако я хотела бы вернуть Dashboard в header, дай мне соответствующий промт для кодекса в ту же ветку feature/auth-api.
````

## Prompt 17 — Codex: возврат пункта Dashboard в header
````text
Ты работаешь в проекте AIForecast, branch feature/auth-api, worktree AIForecast-auth-api.

Контекст:
- Auth flow уже реализован и работает.
- Защищённый app shell находится в app/(protected)/layout.tsx или связанном layout/header-компоненте.
- Ранее из header была убрана ссылка Dashboard, но продуктово мы решили вернуть её для явной навигации.
- / остаётся домашним дашбордом.
- /login должен оставаться без общего header.
- Неавторизованный пользователь всё так же должен попадать на /login.
- Авторизованный пользователь видит protected header.

Задача:
1. Верни ссылку Dashboard в protected header.
2. Header авторизованной части должен содержать:
   - слева логотип/название AIForecast, который ведёт на /
   - навигацию: Dashboard, SKU, Methodology
   - справа user displayName, если он уже выводится
   - кнопку Выйти
3. Ссылка Dashboard должна вести на /.
4. Название AIForecast тоже должно вести на /.
5. Не добавляй кнопку Войти в protected header.
6. Не меняй /login layout: страница логина должна оставаться без общего header.
7. Не меняй auth API, session helpers, Supabase schema, seed, AI files, PROJECT_PLAN.md, PROMPTS.md.
8. Не добавляй новые зависимости.
9. Визуально сохрани текущий аккуратный стиль header.

Разрешено менять только:
- app/(protected)/layout.tsx
- components/layout/*, если header вынесен туда
- components/auth/LogoutButton.tsx только если это технически необходимо, но лучше не трогать

Запрещено менять:
- app/api/auth/*
- lib/auth/*
- lib/supabase/*
- supabase/*
- app/login/page.tsx, если не требуется
- app/api/ai/*
- lib/ai/*
- PROJECT_PLAN.md
- PROMPTS.md
- package.json
- package-lock.json
- .env.local

Проверка:
1. npm run lint
2. npm run build
3. npm run dev
4. Ручная проверка:
   - /login открывается без header
   - после login demo / demo12345 открывается /
   - в header есть Dashboard, SKU, Methodology, Выйти
   - Dashboard ведёт на /
   - AIForecast ведёт на /
   - Выйти переводит на /login
   - после logout прямой заход на / переводит на /login

После завершения покажи:
- список изменённых файлов
- git diff --stat
- результат lint/build
````

## Prompt 18 — Прояснение плана по параллельной разработке
````text
Скажи а в какой момент мы будем параллелить задачи? Сейчас мы делаем последовательно и у нас одновременно загружен только один агент.
````

## Prompt 19 — Предложение по параллельной разработке ui
````text
А мы можем также параллелить ui по экранам, к примеру пока клауд делает дашборд, в другой ветке тому же клауд поручить делать каталог SKU?
````

## Prompt 20 — Утверждение параллельной разработки и обновление PROJECT_PLAN.md
````text
Я утверждаю стратегию распараллеливания. Теперь возьми документ из источников PROJECT_PLAN.md и добавь в него информацию по распараллеливанию, чтобы план стал актуальным и мы, ориентируясь на него, выполняли дальнейшие шаги. Дай мне обновленный документ.
````

## Prompt 21 — Корректировка нагрузки на агентов
````text
Слишком мало задач на Codex и слишком много на Claude в связи с чем я предлагаю подкорректировать документ PROJECT_PLAN_UPDATED.md и распределить роли так:

Codex → feature/ui-methodology / feature/docs
`feature/ai-engine` — Codex делает OpenRouter AI engine.
`feature/ui-sku-detail` — Claude делает карточку SKU.
`feature/docs` — Codex ведёт README/PROMPTS.

Что скажешь? Если согласен, то пришли обновленный файл PROJECT_PLAN_UPDATED.md.
````

## Prompt 22 — Завершение Auth и переход к UI/API contracts
````text
Этап 3 — Auth. Завершен, можем переходить дальше.

Также я обновила документ PROJECT_PLAN.md, в нем были внесены корректировки по организации параллельной работы агентов. Прочитай документ и строй дальнейшие шаги в соответствии с актуализированной версией.

Также учти что в header я оставила кнопку Dashboard вместе с SKU и Methodology. И учти что следующий номер промпта в PROMPTS.md будет 22.
````

## Prompt 23 — Cursor: UI/API contracts и shared UI components
````text
Ты работаешь в проекте AIForecast, branch feature/ui-contracts, worktree AIForecast-ui-contracts.

Контекст проекта:
- Это MVP веб-сервиса для AI-прогнозирования запасов лекарственных средств.
- Следуй актуальному PROJECT_PLAN.md.
- Этапы 1–3 уже завершены: Next.js app, Supabase schema/demo data и Auth.
- Auth flow уже работает.
- Header авторизованной части должен содержать Dashboard, SKU, Methodology и кнопку Выйти.
- Dashboard остаётся ссылкой на /.
- /login остаётся отдельной страницей без общего protected header.
- Сейчас выполняется только Этап 4A: UI/API contracts.
- Цель этапа — зафиксировать DTO и shared UI components перед параллельной разработкой Data API, AI engine и UI-экранов.

Главная задача:
Создать стабильные общие контракты данных и минимальный набор shared UI components, чтобы следующие ветки могли работать параллельно без конфликтов.

Разрешено менять:
- types/api.ts
- components/ui/KpiCard.tsx
- components/ui/RiskBadge.tsx
- components/ui/EmptyState.tsx
- components/ui/LoadingState.tsx
- components/ui/ErrorState.tsx
- components/charts/ChartContainer.tsx
- components/ui/index.ts, если считаешь полезным
- components/charts/index.ts, если считаешь полезным

Можно только читать, но не менять без необходимости:
- types/inventory.ts
- types/ai.ts
- app/(protected)/layout.tsx

Запрещено менять:
- app/api/*
- lib/auth/*
- lib/supabase/*
- lib/ai/*
- lib/dashboard/*
- lib/sku/*
- supabase/*
- app/login/page.tsx
- app/(protected)/page.tsx
- app/(protected)/sku/page.tsx
- app/(protected)/sku/[id]/page.tsx
- app/(protected)/methodology/page.tsx
- components/dashboard/*
- components/sku/*
- components/auth/*
- components/layout/*
- app/globals.css
- package.json
- package-lock.json
- PROJECT_PLAN.md
- PROMPTS.md
- README.md
- .env.example
- .env.local

Задача 1. Создай types/api.ts.

Перед созданием:
- Изучи существующие types/inventory.ts и types/ai.ts.
- Переиспользуй существующие типы через import type, если они уже есть.
- Не дублируй AiForecastAnalysis, SkuItem, InventoryLot, InventoryMovement, если они уже описаны.
- Не ломай существующие типы.

В types/api.ts нужно описать DTO для будущих API endpoints:

1. Общие типы:
- ApiErrorResponse
- RiskLevel: 'low' | 'medium' | 'high' | 'critical'
- PriorityLevel: 'low' | 'medium' | 'high' | 'urgent'
- AbcClass: 'A' | 'B' | 'C'
- TrendDirection: 'declining' | 'stable' | 'growing'
- RiskSummary
- LatestAiForecastSummary
- RecommendationSummary

2. Dashboard DTO:
- DashboardResponse
- DashboardKpi
- DashboardAlert
- DashboardAbcItem
- DashboardCoverageItem
- DashboardForecastVsFactPoint
- DashboardTopRiskSku

DashboardResponse должен покрывать будущие блоки:
- KPI cards;
- AI alerts;
- ABC-анализ;
- дни покрытия;
- forecast vs fact;
- top risk SKU;
- AI status / last forecast info.

3. SKU catalog DTO:
- SkuListResponse
- SkuListItem
- SkuListMeta
- SkuCatalogFiltersState, если полезно для UI.

SkuListItem должен покрывать:
- id;
- name;
- dosageForm;
- category;
- storageCondition;
- shelfLifeDays;
- currentStock;
- unit;
- unitCost;
- inventoryValue;
- daysCoverage;
- abcClass;
- rop;
- eoq;
- stockoutRisk;
- overstockRisk;
- expiryRisk;
- primaryRecommendation;
- latestForecastCreatedAt.

4. SKU detail DTO:
- SkuDetailResponse
- SkuDetailHeader
- SkuLotDto
- SkuMovementDto
- SkuDetailMetric
- SkuForecastVsFactPoint

SkuDetailResponse должен покрывать:
- паспорт SKU;
- партии;
- историю движения;
- forecast vs fact;
- latest AI forecast;
- ROP/EOQ;
- risks;
- recommendations;
- technical AI metadata.

5. AI action DTO:
- AiRecalculateResponse
- AiBatchForecastResponse
- AiBatchForecastItem

Требования к types/api.ts:
- Экспортируй все DTO.
- Используй понятные имена.
- Не добавляй runtime-код.
- Не импортируй React.
- Не импортируй server-only модули.
- Не используй Supabase client.
- Типы должны быть удобны и для Data API, и для UI.

Задача 2. Создай shared UI components.

Создай компоненты:

1. components/ui/KpiCard.tsx
Назначение:
- карточка KPI для dashboard и detail pages.

Props:
- title: string
- value: string | number
- description?: string
- trendLabel?: string
- tone?: 'neutral' | 'success' | 'warning' | 'danger'
- className?: string

Требования:
- простой server-safe React component;
- без use client, если не нужен;
- аккуратный Tailwind;
- не зависит от API fetch.

2. components/ui/RiskBadge.tsx
Назначение:
- отображать risk level.

Props:
- level: RiskLevel
- label?: string
- className?: string

Требования:
- импортируй RiskLevel из types/api.ts;
- подписи по умолчанию:
  - low: Низкий
  - medium: Средний
  - high: Высокий
  - critical: Критический
- визуально различай уровни через Tailwind classes;
- не добавляй внешние зависимости.

3. components/ui/EmptyState.tsx
Props:
- title: string
- description?: string
- action?: React.ReactNode
- className?: string

4. components/ui/LoadingState.tsx
Props:
- title?: string
- description?: string
- className?: string

5. components/ui/ErrorState.tsx
Props:
- title?: string
- description?: string
- action?: React.ReactNode
- className?: string

6. components/charts/ChartContainer.tsx
Назначение:
- общий контейнер для будущих Recharts-графиков.

Props:
- title: string
- description?: string
- children: React.ReactNode
- footer?: React.ReactNode
- className?: string

Требования:
- не добавляй сами графики на этом этапе;
- только общий wrapper с заголовком, описанием и областью для children;
- не используй browser-only API.

Задача 3. Экспорты.
Если в проекте нет index.ts — можешь создать:
- components/ui/index.ts
- components/charts/index.ts

Но только если это не усложнит импорты. Не меняй существующие страницы ради этих экспортов.

Задача 4. Не меняй текущий Auth/header UX.
Проверь, что:
- Dashboard остаётся в header.
- SKU остаётся в header.
- Methodology остаётся в header.
- Выйти остаётся в header.
- /login остаётся без общего header.
Но если для проверки нужно только прочитать файлы — не меняй их.

Задача 5. Проверка качества.
Запусти:
- npm run lint
- npm run build

После завершения покажи:
- список созданных/изменённых файлов;
- git diff --stat;
- результат lint/build;
- подтверждение, что не изменялись запрещённые файлы.

Acceptance criteria:
- types/api.ts создан и экспортирует DTO для dashboard, SKU catalog, SKU detail и AI actions.
- Shared components созданы:
  - KpiCard
  - RiskBadge
  - EmptyState
  - LoadingState
  - ErrorState
  - ChartContainer
- npm run lint проходит.
- npm run build проходит.
- Нет изменений app/api, lib/auth, lib/ai, supabase, production pages и документации.
- Header с Dashboard не изменён.
- Реальная Data API и AI engine не реализованы на этом этапе.
````

## Prompt 24 — Завершение UI/API contracts и переход к Data API
````text
feature/ui-contracts завершена, ошибок нет, все смержено, ветки обновлены. Можем переходить к следующему этапу. Давай каждый запуск параллельной задачи делать отдельным шагом.
````

## Prompt 25 — Codex: Data API для dashboard, SKU catalog и SKU detail
````text
Ты работаешь в проекте AIForecast, branch feature/data-api, worktree AIForecast-data-api.

Контекст проекта:
- Это MVP веб-сервиса для AI-прогнозирования запасов лекарственных средств.
- Следуй актуальному PROJECT_PLAN.md.
- Уже завершены и merged в feature/mvp:
  - Этап 1: Next.js app;
  - Этап 2: Supabase schema и demo data;
  - Этап 3: Auth;
  - Этап 4A: UI/API contracts и shared UI components.
- Header авторизованной части уже содержит Dashboard, SKU, Methodology и кнопку Выйти. Не меняй header.
- /login остаётся отдельной страницей без protected header.
- Сейчас выполняется только Этап 4B: Data API.
- Backend должен быть только через Next.js Route Handlers внутри app/api/.
- Supabase используем только server-side через service role helper.
- Supabase service role key не должен попадать в клиентский код.
- Локальный Supabase через Docker не используем.
- AI engine ещё не реализован, поэтому ai_forecasts может быть пустой таблицей.
- На этом этапе нельзя создавать fake ai_forecasts и нельзя вызывать OpenRouter.

Главная цель:
Реализовать read-only Data API для dashboard, SKU catalog и SKU detail, которое читает реальные demo data из Supabase, возвращает данные в DTO-формате из types/api.ts и корректно работает даже если AI-прогнозы ещё не сгенерированы.

Разрешено менять:
- app/api/dashboard/route.ts
- app/api/sku/route.ts
- app/api/sku/[id]/route.ts
- lib/dashboard/*
- lib/sku/*
- lib/utils/*
- types/api.ts только если обнаружится критичная несовместимость DTO, но сначала постарайся обойтись без изменений
- types/inventory.ts только если нужно безопасное расширение типов под фактическую SQL schema

Можно читать, но не менять без необходимости:
- lib/auth/*
- lib/supabase/server.ts
- types/ai.ts
- supabase/migrations/001_init_schema.sql
- supabase/seed.sql

Запрещено менять:
- app/(protected)/page.tsx
- app/(protected)/sku/page.tsx
- app/(protected)/sku/[id]/page.tsx
- app/(protected)/methodology/page.tsx
- app/(protected)/layout.tsx
- app/login/page.tsx
- components/*
- app/api/auth/*
- app/api/ai/*
- lib/auth/*, кроме крайней необходимости и только если без этого невозможно проверить API session
- lib/ai/*
- supabase/*
- PROJECT_PLAN.md
- PROMPTS.md
- README.md
- package.json
- package-lock.json
- .env.example
- .env.local нельзя коммитить

Задача 1. Изучи существующие контракты и schema:
1. Прочитай types/api.ts.
2. Прочитай types/inventory.ts.
3. Прочитай types/ai.ts.
4. Прочитай Supabase schema в supabase/migrations/001_init_schema.sql.
5. Прочитай seed.sql только чтобы понимать форму demo data.
6. Прочитай lib/supabase/server.ts.
7. Прочитай lib/auth/current-user.ts или аналогичный helper, чтобы понять, как проверить session в API без redirect.

Важно:
- Не дублируй DTO, которые уже есть в types/api.ts.
- Не меняй публичные DTO без крайней необходимости.
- Все API responses должны быть совместимы с types/api.ts.
- Все snake_case поля из БД должны преобразовываться в camelCase DTO для UI.

Задача 2. Реализуй auth guard для Data API:
- Все три Data API endpoint должны требовать авторизацию.
- Если пользователь не авторизован, возвращай JSON 401:
  {
    "error": "Unauthorized"
  }
- Для API не делай redirect('/login').
- Используй существующий non-redirecting current user helper, если он есть.
- Если есть только helper с redirect, не используй его в Route Handlers. Найди существующую функцию, которая возвращает null при отсутствии session.
- Не меняй auth flow и cookie logic.

Задача 3. Создай lib/sku helpers.

Создай файлы на своё усмотрение внутри lib/sku, например:
- lib/sku/queries.ts
- lib/sku/mappers.ts
- lib/sku/metrics.ts

Ожидаемые функции:
1. Получить все SKU из sku_items.
2. Получить партии inventory_lots для набора SKU.
3. Получить движения inventory_movements для набора SKU.
4. Получить latest ai_forecasts для набора SKU.
5. Получить detail по одному SKU.
6. Преобразовать DB rows в DTO.

Требования:
- Для набора из 20 SKU можно делать простые отдельные запросы и reduce в памяти. Не усложняй SQL.
- Не добавляй ORM.
- Не добавляй SQL views.
- Не меняй Supabase schema.
- Не используй client-side Supabase.
- Обрабатывай ошибки Supabase и пробрасывай понятные Error messages на сервере.

Задача 4. Расчёт простых reference metrics.
Код НЕ должен строить отдельный deterministic AI forecast engine.

Можно считать только вспомогательные метрики для dashboard/UI:
- inventoryValue = currentStock * unitCost;
- averageMonthlyOutbound на основе inventory_movements;
- averageDailyOutbound = averageMonthlyOutbound / 30;
- daysCoverage = currentStock / averageDailyOutbound, если averageDailyOutbound > 0, иначе null;
- lot expiry proximity;
- quantityAtRiskByExpiry для партий, которые истекают в ближайшие 90/180 дней;
- ABC class по inventory value:
  - отсортировать SKU по inventoryValue desc;
  - cumulative share <= 80% => A;
  - cumulative share <= 95% => B;
  - остальное => C.

Важно:
- ROP, EOQ, forecast_1m, forecast_3m, forecast_6m, risks и recommendations брать из latest ai_forecasts, если они есть.
- Если latest ai_forecasts нет, возвращать состояние "AI forecast is not generated yet" в совместимом с DTO виде.
- Не подставлять fake ROP/EOQ.
- Не создавать fake ai_forecasts.
- Не вызывать OpenRouter.
- Не реализовывать AI logic.

Задача 5. Реализуй GET /api/sku.
Файл:
- app/api/sku/route.ts

Endpoint:
- должен вернуть SkuListResponse из types/api.ts.
- читает sku_items, inventory_movements, inventory_lots, latest ai_forecasts.
- возвращает список SKU с:
  - id;
  - name;
  - dosageForm;
  - category;
  - storageCondition;
  - shelfLifeDays;
  - currentStock;
  - unit;
  - unitCost;
  - inventoryValue;
  - daysCoverage;
  - abcClass;
  - rop/eoq из latest ai_forecasts, если есть;
  - risks из latest ai_forecasts, если есть;
  - primaryRecommendation из latest ai_forecasts.analysis.recommendations[0], если есть;
  - latestForecastCreatedAt, если есть.
- meta должна включать total и полезные значения для фильтров, если это предусмотрено DTO.

Query params можно поддержать минимально:
- search
- category
- storageCondition
- abcClass
- risk
- sortBy
- sortDirection

Если DTO уже предполагает filters/meta — используй их.
Если проще и безопаснее вернуть все 20 SKU, фильтрацию можно оставить для UI, но query params не должны ломать endpoint.

Задача 6. Реализуй GET /api/sku/[id].
Файл:
- app/api/sku/[id]/route.ts

Endpoint:
- должен вернуть SkuDetailResponse из types/api.ts.
- Next.js 16 style: если params является Promise, используй await params.
- Если SKU не найден, возвращай JSON 404:
  {
    "error": "SKU not found"
  }
- Должен вернуть:
  - паспорт SKU;
  - партии inventory_lots;
  - историю inventory_movements за 18 месяцев;
  - latest AI forecast, если есть;
  - forecast vs fact points;
  - ROP/EOQ из latest ai_forecasts, если есть;
  - risks/recommendations из latest ai_forecasts.analysis, если есть;
  - technical AI metadata: model, createdAt, inputHash, confidence, если есть.
- Если latest ai_forecasts нет, endpoint должен всё равно вернуть SKU detail и явно показать, что AI-прогноз ещё не рассчитан.

Задача 7. Создай lib/dashboard helpers.

Создай файлы на своё усмотрение внутри lib/dashboard, например:
- lib/dashboard/queries.ts
- lib/dashboard/mappers.ts
- lib/dashboard/metrics.ts

Dashboard должен использовать те же базовые данные:
- sku_items;
- inventory_lots;
- inventory_movements;
- latest ai_forecasts.

Не дублируй сложную логику, если её можно переиспользовать из lib/sku/metrics.ts.

Задача 8. Реализуй GET /api/dashboard.
Файл:
- app/api/dashboard/route.ts

Endpoint:
- должен вернуть DashboardResponse из types/api.ts.
- Должен покрыть будущие блоки UI:
  1. KPI cards:
     - total SKU;
     - SKU with stockout risk high/critical из latest AI forecasts;
     - SKU with overstock risk high/critical из latest AI forecasts;
     - SKU with expiry risk high/critical или партии с близким сроком годности;
     - total inventory value;
     - potential write-off value по партиям с близким expiry.
  2. AI alerts:
     - из latest AI forecasts.analysis.risks и recommendations, если есть;
     - если AI forecasts ещё нет, вернуть пустой список alerts и AI status "not generated yet".
  3. ABC analysis:
     - count/value/share по A/B/C.
  4. Days coverage:
     - top/bottom coverage items.
  5. Forecast vs fact:
     - агрегированные monthly actual outbound;
     - forecast values из latest AI forecasts, если есть;
     - если forecast отсутствует, points должны быть безопасными для UI и не притворяться AI-прогнозом.
  6. Top risk SKU:
     - SKU с high/critical рисками из latest AI forecasts;
     - если AI forecasts нет, можно вернуть SKU с ближайшим expiry или минимальным daysCoverage как reference risk, но подпись должна быть честной.
  7. AI status:
     - total SKU;
     - forecasted SKU count;
     - latestForecastCreatedAt;
     - model;
     - статус, что AI forecasts ещё не сгенерированы, если ai_forecasts пустая.

Важно:
- Не делай AI-вызовов.
- Не записывай в БД.
- Endpoint read-only.

Задача 9. Error handling.
- В каждом route используй try/catch.
- В server console можно писать короткий error для debug.
- Клиенту возвращай аккуратный JSON:
  {
    "error": "..."
  }
- Не раскрывай секреты, SQL details и stack trace в response.

Задача 10. Проверка качества.
Запусти:
- npm run lint
- npm run build

Затем запусти dev server:
- npm run dev

Ручная проверка через PowerShell с session cookie:
1. Создай web session:
   $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

2. Логин:
   Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/auth/login -ContentType "application/json" -Body '{"username":"demo","password":"demo12345"}' -WebSession $session

3. Dashboard:
   Invoke-RestMethod -Method Get -Uri http://localhost:3000/api/dashboard -WebSession $session

4. SKU list:
   Invoke-RestMethod -Method Get -Uri http://localhost:3000/api/sku -WebSession $session

5. Выбери id первого SKU из ответа и проверь:
   Invoke-RestMethod -Method Get -Uri "http://localhost:3000/api/sku/<SKU_ID>" -WebSession $session

6. Проверь unauthorized:
   Invoke-RestMethod -Method Get -Uri http://localhost:3000/api/dashboard

Ожидаемо:
- с session cookie endpoints возвращают 200 и DTO;
- без session cookie endpoints возвращают 401 JSON;
- /api/sku возвращает 20 SKU;
- /api/sku/[id] возвращает detail, lots и movements;
- /api/dashboard возвращает KPI/ABC/coverage/status;
- если ai_forecasts пустая, endpoints не падают.

После завершения покажи:
- список созданных/изменённых файлов;
- git diff --stat;
- результат npm run lint;
- результат npm run build;
- результаты ручной проверки endpoints;
- подтверждение, что .env.local не попал в git;
- подтверждение, что запрещённые файлы не изменялись.

Acceptance criteria:
- GET /api/dashboard реализован и защищён.
- GET /api/sku реализован и защищён.
- GET /api/sku/[id] реализован и защищён.
- Все endpoints читают реальные Supabase demo data.
- Все endpoints возвращают DTO из types/api.ts.
- ai_forecasts может быть пустой, и это не ломает endpoints.
- Нет fake AI forecasts.
- Нет OpenRouter вызовов.
- Нет изменений UI pages/components.
- Нет изменений Auth flow.
- Нет изменений Supabase schema/seed.
- npm run lint проходит.
- npm run build проходит.
````

## Prompt 26 — Запуск следующей параллельной задачи после Data API
````text
Шаг запущен в параллель, давай следующий шаг.
````

## Prompt 27 — Добавление ключа openrouter.ai
````text
У меня есть ключ от https://openrouter.ai/ и env файл, как его правильно заполнить, чтобы ии мог подключаться и слать запросы из typescript?

NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
OPENROUTER_API_KEY=
OPENROUTER_MODEL=openai/gpt-4o-mini
OPENROUTER_SITE_URL=http://localhost:3000
OPENROUTER_APP_TITLE=AIForecast
AI_BATCH_LIMIT=5
````

## Prompt 28 — Проверка ключа openrouter.ai
````text
Как проверить, что переменные заполнены верно, и подключение возможно из Cursor IDE?
````

## Prompt 29 — Codex: OpenRouter AI forecast engine
````text
Ты работаешь в проекте AIForecast, branch feature/ai-engine, worktree AIForecast-ai-engine.

Контекст проекта:
- Это MVP веб-сервиса для AI-прогнозирования запасов лекарственных средств.
- Следуй актуальному PROJECT_PLAN.md.
- Уже завершены и merged в feature/mvp:
  - Next.js app;
  - Supabase schema и demo data;
  - Auth;
  - UI/API contracts.
- Параллельно сейчас работает feature/data-api. Она может менять app/api/dashboard/*, app/api/sku/*, lib/dashboard/*, lib/sku/*.
- Поэтому в этой ветке НЕ трогай Data API и НЕ меняй lib/sku/*, чтобы не создавать конфликты.
- Backend только через Next.js Route Handlers внутри app/api/.
- Supabase используем только server-side через service role helper.
- Supabase service role key не должен попадать в клиентский код.
- OpenRouter вызываем только server-side.
- Локальный Supabase через Docker не используем.
- AI является главным forecast/decision engine.
- Код не должен строить отдельный deterministic forecast engine.
- Код может считать только справочные метрики для входного контекста AI и guardrails для валидации результата.
- Сейчас выполняется только Этап 5: AI forecast engine.

Главная цель:
Реализовать реальный OpenRouter AI forecast engine:
1. POST /api/ai/forecast/[skuId]
2. POST /api/ai/forecast/batch
3. OpenRouter client
4. structured JSON schema
5. Zod validation
6. сбор SKU-контекста из Supabase
7. сохранение результата в ai_forecasts
8. run-log в ai_forecast_runs
9. защита от лишних повторных вызовов через input_hash
10. корректная работа с Auth

Разрешено менять:
- app/api/ai/forecast/[skuId]/route.ts
- app/api/ai/forecast/batch/route.ts
- lib/ai/*
- types/ai.ts
- types/api.ts только если есть критичная несовместимость с уже утверждёнными DTO, но лучше не менять
- lib/auth/* только если уже нет способа получить current user без redirect; если возможно, только читать
- lib/supabase/server.ts только если обнаружена критичная ошибка, но сначала объясни в ответе зачем
- .env.example только если отсутствует переменная из PROJECT_PLAN.md, но скорее всего не менять

Можно читать:
- supabase/migrations/001_init_schema.sql
- supabase/seed.sql
- types/inventory.ts
- types/api.ts
- lib/auth/*
- lib/supabase/server.ts

Запрещено менять:
- app/api/dashboard/*
- app/api/sku/*
- lib/dashboard/*
- lib/sku/*
- app/(protected)/*
- app/login/page.tsx
- components/*
- supabase/*
- PROJECT_PLAN.md
- PROMPTS.md
- README.md
- package.json
- package-lock.json
- .env.local нельзя коммитить
- любые UI-файлы

Задача 1. Изучи текущие файлы:
1. PROJECT_PLAN.md
2. types/ai.ts
3. types/api.ts
4. types/inventory.ts
5. supabase/migrations/001_init_schema.sql
6. lib/supabase/server.ts
7. lib/auth/current-user.ts или аналогичные auth helpers
8. app/api/auth/*, чтобы понять API auth style

Важно:
- Не дублируй уже существующий AiForecastAnalysis, если он есть.
- Если types/ai.ts уже содержит AiForecastAnalysis, используй его.
- Если нужна Zod-схема, создай её в lib/ai/schema.ts, а не меняй типы без необходимости.
- UI не трогай.

Задача 2. Реализуй OpenRouter client.

Создай:
- lib/ai/openrouter.ts

Требования:
- Используй пакет openai, если он уже установлен.
- Используй OpenAI-compatible client:
  - apiKey: process.env.OPENROUTER_API_KEY
  - baseURL: "https://openrouter.ai/api/v1"
- Не создавай client на top-level, если из-за env может падать build.
- Экспортируй функцию createOpenRouterClient().
- Если OPENROUTER_API_KEY отсутствует, бросай понятную server-side ошибку.
- Модель брать из process.env.OPENROUTER_MODEL или использовать fallback "openai/gpt-4o-mini".
- Для OpenRouter headers используй:
  - HTTP-Referer из OPENROUTER_SITE_URL, если есть
  - X-Title из OPENROUTER_APP_TITLE, если есть
- Не отправляй ключи в browser.
- Не логируй API key.

Задача 3. Реализуй AI response Zod schema.

Создай:
- lib/ai/schema.ts

Schema должна соответствовать AiForecastAnalysis из types/ai.ts и PROJECT_PLAN.md:

AiForecastAnalysis:
- skuId: string
- forecast:
  - oneMonthDemand: number >= 0
  - threeMonthDemand: number >= 0
  - sixMonthDemand: number >= 0
  - confidence: number between 0 and 1
  - trend: "declining" | "stable" | "growing"
  - seasonality: string
  - anomalies: array of:
    - period: string
    - type: "spike" | "drop" | "writeoff" | "supply_gap"
    - explanation: string
- reorder:
  - rop: number >= 0
  - eoq: number >= 0
  - safetyStock: number >= 0
  - leadTimeDemand: number >= 0
  - explanation: string
- risks:
  - stockout:
    - level: "low" | "medium" | "high" | "critical"
    - daysToStockout: number >= 0 or null
    - explanation: string
  - overstock:
    - level: "low" | "medium" | "high" | "critical"
    - daysCoverage: number >= 0 or null
    - explanation: string
  - expiry:
    - level: "low" | "medium" | "high" | "critical"
    - quantityAtRisk: number >= 0
    - explanation: string
- recommendations: array of:
  - action: "reorder" | "accelerate_sales" | "write_off" | "monitor" | "adjust_safety_stock"
  - priority: "low" | "medium" | "high" | "urgent"
  - suggestedQuantity?: number >= 0
  - deadlineDays?: number >= 0
  - reasoning: string
- executiveSummary: string

Экспортируй:
- aiForecastAnalysisSchema
- type AiForecastAnalysisInput если нужно
- jsonSchema для OpenRouter response_format, если реализуешь вручную

Важно:
- Для OpenRouter structured output нужен JSON Schema.
- Не полагайся только на prompt. После ответа модели обязательно валидируй Zod.
- Если модель вернула строку JSON, распарси её безопасно.
- Если модель вернула объект, валидируй объект.

Задача 4. Реализуй JSON Schema для OpenRouter structured outputs.

Создай:
- lib/ai/json-schema.ts

Требования:
- Экспортируй объект aiForecastJsonSchema.
- Schema должна соответствовать AiForecastAnalysis.
- additionalProperties: false на ключевых уровнях.
- required для всех обязательных полей.
- Используй type: "object", properties, required.
- Для nullable числовых полей используй type: ["number", "null"], если поддерживается, или anyOf.
- Для enum используй enum.

В OpenRouter request используй response_format:
{
  type: "json_schema",
  json_schema: {
    name: "ai_forecast_analysis",
    strict: true,
    schema: aiForecastJsonSchema
  }
}

Задача 5. Реализуй сбор AI context.

Создай:
- lib/ai/context.ts

Требования:
- Не используй lib/sku/*, потому что feature/data-api меняет его параллельно.
- Прямо через createSupabaseAdminClient() прочитай:
  - sku_items по skuId;
  - inventory_lots по skuId;
  - inventory_movements по skuId order by period_month asc;
  - последний ai_forecasts по skuId order by created_at desc limit 1.
- Если SKU не найден, брось NotFound error или верни понятный result для route.
- Собери компактный контекст для AI:
  - sku passport;
  - current stock;
  - costs;
  - lead time;
  - service level;
  - storage condition;
  - shelf life;
  - lots with expiry;
  - movement history 18 months;
  - anomaly months from anomaly_flag/anomaly_note;
  - simple reference metrics:
    - average monthly outbound;
    - last 3 months outbound average;
    - average daily outbound;
    - days coverage;
    - writeoff total;
    - inbound total;
    - outbound total;
    - expiry quantity in 90 days;
    - expiry quantity in 180 days.
- Эти метрики только для входа AI и guardrails, не как deterministic forecast.
- Экспортируй:
  - buildAiForecastContext(skuId: string)
  - buildAiInputHash(context)
- input_hash должен быть стабильным для одинакового контекста.
- Используй node:crypto createHash("sha256").
- Не включай секреты в hash/input.

Задача 6. Реализуй prompt builder.

Создай:
- lib/ai/prompt.ts

Требования:
- Системный prompt:
  - ты AI-аналитик supply chain для фармацевтической компании;
  - анализируешь запасы ЛС;
  - учитываешь сезонность, тренды, аномалии, lead time, срок годности, списания;
  - возвращаешь только JSON по schema;
  - не добавляешь markdown;
  - не выдумываешь SKU, которых нет во входе;
  - ROP/EOQ должны быть неотрицательными;
  - если данных мало, снижай confidence и объясняй uncertainty;
  - рекомендации должны быть практическими.
- User prompt:
  - передай compact JSON context.
- Не делай prompt слишком длинным.
- Сохрани язык вывода: русский для explanations/recommendations.
- Названия enum должны быть строго на английском, как в schema.

Экспортируй:
- buildAiForecastMessages(context)

Задача 7. Реализуй service для вызова AI.

Создай:
- lib/ai/forecast-service.ts

Функция:
- generateAiForecastForSku(skuId: string, options?: { force?: boolean })

Логика:
1. Собрать context.
2. Посчитать input_hash.
3. Проверить последний ai_forecasts:
   - если latest.input_hash совпадает и force !== true, вернуть cached результат без нового OpenRouter вызова.
   - в response/metadata явно указать source: "cache".
4. Если cache miss или force true:
   - создать run в ai_forecast_runs со status "running" или "started", если status check constraints позволяют; если в schema status свободный text, используй "running".
   - вызвать OpenRouter.
   - запросить structured JSON.
   - распарсить ответ.
   - провалидировать Zod.
   - применить guardrails:
     - skuId в ответе должен совпадать с requested skuId;
     - forecast numbers >= 0;
     - rop/eoq >= 0;
     - confidence 0..1.
   - сохранить в ai_forecasts:
     - sku_id
     - model
     - input_hash
     - forecast_1m
     - forecast_3m
     - forecast_6m
     - rop
     - eoq
     - stockout_risk
     - overstock_risk
     - expiry_risk
     - confidence
     - analysis
     - raw_response
   - обновить run status "success", finished_at.
   - вернуть saved forecast + analysis + source: "openrouter".
5. При ошибке:
   - записать run status "error", error_message, finished_at, если run создан.
   - пробросить понятную ошибку наверх.
6. Не создавай fake fallback forecast.
7. Не делай автоматический retry больше 1 раза.
8. Если retry реализуешь — только при parse/validation error, и запиши это аккуратно.

Важно:
- Нельзя возвращать fake forecast при ошибке OpenRouter.
- Если OpenRouter недоступен, endpoint должен вернуть ошибку, а не поддельные данные.
- Это осознанное решение для демонстрации реального AI.

Задача 8. Реализуй persistence helpers.

Можно создать:
- lib/ai/persistence.ts

Функции:
- getLatestForecastForSku(skuId)
- insertForecast(...)
- insertForecastRun(...)
- updateForecastRun(...)
- mapForecastRowToDto(...)

Не меняй Data API helpers.

Задача 9. Реализуй API route POST /api/ai/forecast/[skuId].

Файл:
- app/api/ai/forecast/[skuId]/route.ts

Требования:
- Только POST.
- Требует авторизацию.
- Для API при отсутствии session возвращай JSON 401:
  { "error": "Unauthorized" }
- Не делай redirect('/login') из API route.
- Params в Next.js 16 могут быть Promise, используй await params, если так сделано в проекте.
- Body optional:
  {
    "force": true
  }
- Если SKU не найден, возвращай 404 JSON:
  { "error": "SKU not found" }
- При успехе возвращай JSON с:
  - skuId
  - source: "cache" | "openrouter"
  - model
  - inputHash
  - forecast
  - createdAt
  - analysis
- Тип ответа должен быть совместим с AiRecalculateResponse из types/api.ts.
- Не меняй DTO без крайней необходимости.
- Не вызывай OpenRouter при cache hit, если force !== true.

Задача 10. Реализуй API route POST /api/ai/forecast/batch.

Файл:
- app/api/ai/forecast/batch/route.ts

Требования:
- Только POST.
- Требует авторизацию.
- Body:
  {
    "skuIds": ["..."],
    "force": false
  }
- Если skuIds не переданы или пустые:
  - выбери первые N SKU из sku_items order by created_at asc.
- N ограничить AI_BATCH_LIMIT из env, default 5.
- Не запускать больше лимита.
- Обрабатывай SKU последовательно, не параллельно, чтобы не сжечь бюджет.
- Для каждого SKU:
  - вызвать generateAiForecastForSku(skuId, { force })
  - сохранить success/error item
- Общий response совместим с AiBatchForecastResponse из types/api.ts:
  - totalRequested
  - processed
  - succeeded
  - failed
  - items
- Если один SKU упал, batch не должен падать целиком.
- Не возвращай stack trace.

Задача 11. Auth в AI API.

- Используй существующий helper, который возвращает user/null.
- Если есть только redirect-helper, не используй его в API.
- Если нужно, создай маленький helper в lib/auth только если это не ломает auth:
  - requireApiUser(): Promise<{ id; username; displayName } | null>
- Но сначала проверь существующие helpers.
- Не меняй login/logout/me logic.

Задача 12. Проверка качества.

Запусти:
- npm run lint
- npm run build

Затем dev server:
- npm run dev

Ручная проверка PowerShell:

1. Создать session:
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

2. Login:
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/auth/login -ContentType "application/json" -Body '{"username":"demo","password":"demo12345"}' -WebSession $session

3. Получить один SKU id.
Если feature/data-api ещё не merged в эту ветку, /api/sku может отсутствовать. Тогда временно возьми SKU id из Supabase Table Editor.
Если /api/sku есть, можно:
$skuList = Invoke-RestMethod -Method Get -Uri http://localhost:3000/api/sku -WebSession $session
$skuId = $skuList.items[0].id

4. Запустить AI forecast для одного SKU:
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/ai/forecast/$skuId" -ContentType "application/json" -Body '{"force":true}' -WebSession $session

5. Повторить без force:
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/ai/forecast/$skuId" -ContentType "application/json" -Body '{}' -WebSession $session

Ожидаемо второй вызов должен вернуть source "cache", если input_hash не изменился.

6. Batch на 2 SKU:
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/ai/forecast/batch -ContentType "application/json" -Body '{"skuIds":["SKU_ID_1","SKU_ID_2"],"force":false}' -WebSession $session

7. Unauthorized:
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/ai/forecast/$skuId" -ContentType "application/json" -Body '{}'

Ожидаемо:
- без session cookie 401 JSON;
- с session cookie POST по одному SKU возвращает AI analysis;
- повторный вызов без force возвращает cache;
- batch возвращает summary items;
- ai_forecasts пополняется;
- ai_forecast_runs пополняется;
- ошибок build/lint нет.

Если OpenRouter вызов не проходит:
- Не создавай fake fallback.
- Покажи текст ошибки без секретов.
- Проверь env OPENROUTER_API_KEY и модель.
- Не логируй API key.

После завершения покажи:
- список созданных/изменённых файлов;
- git diff --stat;
- результат npm run lint;
- результат npm run build;
- результат ручной проверки одного SKU;
- результат проверки cache hit;
- результат batch на 1–2 SKU;
- подтверждение, что .env.local не попал в git;
- подтверждение, что запрещённые файлы не изменялись.

Acceptance criteria:
- POST /api/ai/forecast/[skuId] реализован и защищён.
- POST /api/ai/forecast/batch реализован и защищён.
- Реальный OpenRouter вызов работает.
- Structured JSON используется.
- Zod validation используется.
- AI result сохраняется в ai_forecasts.
- Run-log пишется в ai_forecast_runs.
- Cache по input_hash работает.
- Нет fake fallback forecast.
- Нет изменений UI.
- Нет изменений Data API.
- Нет изменений Supabase schema/seed.
- npm run lint проходит.
- npm run build проходит.
````

## Prompt 30 — Запуск UI Dashboard после AI engine
````text
feature/ai-engine запущена давай следующий шаг в параллель
````

## Prompt 31 — Claude: Dashboard UI screen
````text
Ты работаешь в проекте AIForecast, branch feature/ui-dashboard, worktree AIForecast-ui-dashboard.

Контекст проекта:
- Это MVP веб-сервиса для AI-прогнозирования запасов лекарственных средств.
- Следуй актуальному PROJECT_PLAN.md.
- Уже завершены и merged в feature/mvp:
  - Next.js app;
  - Supabase schema и demo data;
  - Auth;
  - UI/API contracts.
- Сейчас параллельно работают:
  - feature/data-api: реализует /api/dashboard, /api/sku, /api/sku/[id]
  - feature/ai-engine: реализует OpenRouter AI endpoints
- Поэтому в этой ветке НЕ трогай app/api/*, lib/*, types/* и shared components.
- Эта ветка отвечает только за визуальный dashboard screen.
- Header уже реализован в protected layout и содержит Dashboard, SKU, Methodology, Выйти. Не меняй header.
- /login остаётся отдельной страницей без protected header. Не меняй login.

Цель:
Собрать красивый, демонстрационно убедительный dashboard на странице /, который после merge Data API сможет читать DashboardResponse из /api/dashboard.

Dashboard должен показать ценность продукта за 30 секунд:
- KPI;
- AI alerts;
- ABC-анализ;
- дни покрытия;
- forecast vs fact;
- top risk SKU;
- AI status / last forecast info.

Разрешено менять:
- app/(protected)/page.tsx
- components/dashboard/*
- components/charts/dashboard/*

Разрешено использовать, но НЕ менять:
- components/ui/KpiCard.tsx
- components/ui/RiskBadge.tsx
- components/ui/EmptyState.tsx
- components/ui/LoadingState.tsx
- components/ui/ErrorState.tsx
- components/charts/ChartContainer.tsx
- types/api.ts
- types/ai.ts
- types/inventory.ts

Запрещено менять:
- app/(protected)/layout.tsx
- app/login/page.tsx
- app/(protected)/sku/*
- app/(protected)/methodology/page.tsx
- app/api/*
- lib/*
- supabase/*
- components/ui/*
- components/charts/ChartContainer.tsx
- components/auth/*
- components/layout/*
- components/sku/*
- types/*
- PROJECT_PLAN.md
- PROMPTS.md
- README.md
- package.json
- package-lock.json
- .env.example
- .env.local

Задача 1. Изучи контракты и shared components:
- types/api.ts
- components/ui/KpiCard.tsx
- components/ui/RiskBadge.tsx
- components/ui/EmptyState.tsx
- components/ui/LoadingState.tsx
- components/ui/ErrorState.tsx
- components/charts/ChartContainer.tsx
- app/(protected)/layout.tsx только чтобы понять header, но не меняй его.

Задача 2. Реализуй dashboard page.
Файл:
- app/(protected)/page.tsx

Страница должна:
- быть защищённой через существующий protected layout;
- не реализовывать auth самостоятельно;
- рендерить dashboard UI;
- использовать компоненты из components/dashboard/*;
- не обращаться к Supabase напрямую;
- не вызывать OpenRouter напрямую;
- получать данные только через /api/dashboard.

Важно:
Так как feature/data-api может быть ещё не merged в эту ветку, /api/dashboard может временно отвечать 404 в этой worktree. Поэтому UI должен корректно показывать error/empty state, но не должен содержать fake business data в коде.

Задача 3. Создай dashboard client component.
Создай, например:
- components/dashboard/DashboardClient.tsx

Требования:
- Это client component.
- Делает fetch("/api/dashboard") после mount.
- Использует credentials same-origin по умолчанию.
- Типизирует ответ как DashboardResponse из types/api.ts.
- Состояния:
  - loading;
  - error;
  - empty/no AI forecast yet;
  - success.
- Если endpoint вернул 401, показать понятное сообщение, но не реализовывать logout/auth.
- Если endpoint пока 404, показать аккуратный message: "Dashboard API ещё не подключён".
- Не добавляй моковые SKU, моковые AI forecasts или fake business data.
- Не пиши demo data в TypeScript.
- Никаких OpenRouter вызовов из UI.

Задача 4. Создай dashboard sections.
Создай файлы на своё усмотрение внутри components/dashboard, например:
- DashboardHeader.tsx
- DashboardKpiGrid.tsx
- DashboardAlerts.tsx
- DashboardAbcPanel.tsx
- DashboardCoveragePanel.tsx
- DashboardForecastPanel.tsx
- DashboardTopRisks.tsx
- DashboardAiStatus.tsx

Требования:
- Используй DashboardResponse и дочерние DTO из types/api.ts.
- Используй KpiCard для KPI.
- Используй RiskBadge для risks.
- Используй EmptyState, LoadingState, ErrorState.
- Используй ChartContainer для графиков.
- Для графиков можно использовать Recharts, уже установленный в проекте.
- Графики должны быть визуально аккуратными:
  - ABC: PieChart или BarChart;
  - days coverage: BarChart;
  - forecast vs fact: LineChart или ComposedChart.
- Не задавай тяжёлую кастомную графическую систему.
- Не добавляй новые зависимости.
- Не меняй app/globals.css.
- Используй Tailwind classes локально.

Задача 5. UX и визуальная иерархия.
Dashboard должен выглядеть как бизнес-продукт, а не placeholder.

Обязательные блоки:
1. Hero/header внутри страницы:
   - title: "Dashboard"
   - subtitle: "AI-прогнозирование запасов лекарственных средств"
   - короткое пояснение, что данные загружаются из Supabase, а AI-анализ сохраняется после OpenRouter-прогноза.
2. KPI grid:
   - total SKU;
   - stockout risk;
   - overstock risk;
   - expiry risk;
   - inventory value или potential write-off.
3. AI alerts:
   - список alert cards;
   - если alerts пустые, EmptyState с текстом "AI-алерты появятся после расчёта прогноза".
4. ABC-анализ:
   - график;
   - краткое объяснение A/B/C.
5. Days coverage:
   - график или список SKU по покрытию.
6. Forecast vs fact:
   - график;
   - если forecast ещё не рассчитан, честный empty state.
7. Top risk SKU:
   - компактный список с risk badge.
8. AI status:
   - модель;
   - дата последнего расчёта;
   - количество SKU с forecast;
   - состояние "not generated yet", если прогнозы ещё не рассчитаны.

Задача 6. Кнопки.
Можно добавить неактивную/информационную кнопку или link:
- "Перейти к каталогу SKU" → /sku
- "Открыть методологию" → /methodology

Не добавляй кнопку пересчёта AI на dashboard в этой ветке, чтобы не конфликтовать с AI engine. Пересчёт будет на SKU detail.

Задача 7. Не ломай сборку, если Data API ещё нет.
Так как /api/dashboard может появиться после merge feature/data-api:
- fetch должен иметь try/catch;
- error state должен быть нормальным;
- build не должен зависеть от доступности API;
- не делай server-side fetch к /api/dashboard на build time.

Задача 8. Проверка качества.
Запусти:
- npm run lint
- npm run build

Затем dev server:
- npm run dev

Ручная проверка:
1. Открыть /login.
2. Войти demo / demo12345.
3. Перейти на /.
4. Убедиться, что header содержит Dashboard, SKU, Methodology, Выйти.
5. Убедиться, что dashboard выглядит как готовый экран, даже если /api/dashboard пока не готов.
6. Проверить, что /sku и /methodology не изменены.
7. Проверить browser console: нет React/runtime errors.

После завершения покажи:
- список созданных/изменённых файлов;
- git diff --stat;
- результат npm run lint;
- результат npm run build;
- что /login/header не изменялись;
- что app/api, lib, supabase, types и shared components не изменялись.

Acceptance criteria:
- / выглядит как полноценный dashboard screen.
- Dashboard UI использует DashboardResponse из types/api.ts.
- UI готов к подключению /api/dashboard.
- Есть loading/error/empty/success states.
- Нет fake demo data в TypeScript.
- Нет OpenRouter/Supabase вызовов из UI.
- Header не изменён и содержит Dashboard, SKU, Methodology, Выйти.
- /login не изменён.
- app/api/* не изменялись.
- lib/* не изменялись.
- components/ui/* не изменялись.
- npm run lint проходит.
- npm run build проходит.
````

## Prompt 32 — Запуск SKU Catalog UI после Dashboard UI
````text
Запустила AIForecast-ui-dashboard. Давай следующий шаг в параллель.
````

## Prompt 33 — Claude: SKU Catalog UI screen
````text
Ты работаешь в проекте AIForecast, branch feature/ui-sku-catalog, worktree AIForecast-ui-sku-catalog.

Контекст проекта:
- Это MVP веб-сервиса для AI-прогнозирования запасов лекарственных средств.
- Следуй актуальному PROJECT_PLAN.md.
- Уже завершены и merged в feature/mvp:
  - Next.js app;
  - Supabase schema и demo data;
  - Auth;
  - UI/API contracts.
- Сейчас параллельно работают:
  - feature/data-api: реализует /api/dashboard, /api/sku, /api/sku/[id]
  - feature/ai-engine: реализует OpenRouter AI endpoints
  - feature/ui-dashboard: реализует dashboard UI
- Поэтому в этой ветке НЕ трогай app/api/*, lib/*, types/*, dashboard files и SKU detail files.
- Эта ветка отвечает только за визуальный экран каталога SKU.
- Header уже реализован в protected layout и содержит Dashboard, SKU, Methodology, Выйти. Не меняй header.
- /login остаётся отдельной страницей без protected header. Не меняй login.

Цель:
Собрать красивый, демонстрационно убедительный SKU catalog на странице /sku, который после merge Data API сможет читать SkuListResponse из /api/sku.

Каталог должен выглядеть как рабочий бизнес-инструмент:
- список SKU;
- поиск;
- фильтры;
- сортировка;
- текущий остаток;
- дни покрытия;
- ABC-класс;
- ROP;
- EOQ;
- AI-риски;
- AI-рекомендация;
- переход в карточку SKU.

Разрешено менять:
- app/(protected)/sku/page.tsx
- components/sku/catalog/*

Разрешено использовать, но НЕ менять:
- components/ui/KpiCard.tsx
- components/ui/RiskBadge.tsx
- components/ui/EmptyState.tsx
- components/ui/LoadingState.tsx
- components/ui/ErrorState.tsx
- components/charts/ChartContainer.tsx
- types/api.ts
- types/ai.ts
- types/inventory.ts

Запрещено менять:
- app/(protected)/page.tsx
- app/(protected)/sku/[id]/page.tsx
- app/(protected)/methodology/page.tsx
- app/(protected)/layout.tsx
- app/login/page.tsx
- app/api/*
- lib/*
- supabase/*
- components/dashboard/*
- components/charts/dashboard/*
- components/charts/sku/*
- components/sku/detail/*
- components/ui/*
- components/auth/*
- components/layout/*
- types/*
- PROJECT_PLAN.md
- PROMPTS.md
- README.md
- package.json
- package-lock.json
- .env.example
- .env.local

Задача 1. Изучи контракты и shared components:
- types/api.ts
- components/ui/KpiCard.tsx
- components/ui/RiskBadge.tsx
- components/ui/EmptyState.tsx
- components/ui/LoadingState.tsx
- components/ui/ErrorState.tsx
- app/(protected)/layout.tsx только чтобы понять header, но не меняй его.

Задача 2. Реализуй SKU catalog page.
Файл:
- app/(protected)/sku/page.tsx

Страница должна:
- быть защищённой через существующий protected layout;
- не реализовывать auth самостоятельно;
- рендерить SKU catalog UI;
- использовать компоненты из components/sku/catalog/*;
- не обращаться к Supabase напрямую;
- не вызывать OpenRouter напрямую;
- получать данные только через /api/sku.

Важно:
Так как feature/data-api может быть ещё не merged в эту ветку, /api/sku может временно отвечать 404. Поэтому UI должен корректно показывать error/empty state, но не должен содержать fake business data в коде.

Задача 3. Создай catalog client component.
Создай, например:
- components/sku/catalog/SkuCatalogClient.tsx

Требования:
- Это client component.
- Делает fetch("/api/sku") после mount.
- Типизирует ответ как SkuListResponse из types/api.ts.
- Состояния:
  - loading;
  - error;
  - empty;
  - success.
- Если endpoint вернул 401, показать понятное сообщение.
- Если endpoint пока 404, показать аккуратное сообщение: "SKU API ещё не подключён".
- Не добавляй моковые SKU или fake business data.
- Не пиши demo data в TypeScript.
- Никаких OpenRouter вызовов из UI.

Задача 4. Создай catalog sections/components.
Создай файлы на своё усмотрение внутри components/sku/catalog, например:
- SkuCatalogHeader.tsx
- SkuCatalogFilters.tsx
- SkuCatalogTable.tsx
- SkuCatalogCardGrid.tsx, если нужен responsive mobile view
- SkuCatalogSummary.tsx
- SkuCatalogToolbar.tsx

Требования:
- Используй SkuListResponse, SkuListItem, SkuCatalogFiltersState из types/api.ts.
- Используй RiskBadge для рисков.
- Используй EmptyState, LoadingState, ErrorState.
- Если нужно показать KPI summary, можно использовать KpiCard.
- Не добавляй новые зависимости.
- Не меняй app/globals.css.
- Используй Tailwind classes локально.

Задача 5. UX и визуальная иерархия.
Catalog должен выглядеть как рабочий экран, а не placeholder.

Обязательные блоки:
1. Header внутри страницы:
   - title: "Каталог SKU"
   - subtitle: "Остатки, сроки годности, риски и AI-рекомендации по товарным позициям"
   - краткое пояснение, что данные загружаются из Supabase, а AI-метрики появляются после расчёта прогноза.
2. Summary cards:
   - всего SKU;
   - суммарная стоимость запасов, если есть в DTO/meta;
   - SKU с критическими рисками, если есть;
   - SKU без AI-прогноза, если можно определить из DTO.
3. Search:
   - поиск по названию, категории или условиям хранения.
4. Filters:
   - ABC A/B/C;
   - risk level;
   - storageCondition;
   - category.
5. Sorting:
   - risk;
   - daysCoverage;
   - inventoryValue;
   - currentStock;
   - latestForecastCreatedAt.
6. Table:
   Колонки:
   - препарат;
   - форма выпуска;
   - категория;
   - хранение;
   - текущий остаток;
   - стоимость запаса;
   - дни покрытия;
   - ABC;
   - ROP;
   - EOQ;
   - риски;
   - рекомендация;
   - действие "Открыть".
7. Responsive:
   - на desktop таблица;
   - на mobile допустимы карточки или горизонтальный scroll.
8. Empty states:
   - нет SKU;
   - нет AI-прогноза;
   - API ещё не подключён.

Задача 6. Фильтрация и сортировка.
Фильтрацию и сортировку можно сделать на клиенте по уже загруженным 20 SKU.

Требования:
- Не добавляй query params в URL, если это усложняет.
- Не вызывай API на каждое изменение фильтра.
- Сначала fetch all, затем filter/sort в памяти.
- Search должен быть case-insensitive.
- Если поле отсутствует или null, UI не должен падать.
- Для отсутствующих ROP/EOQ показывай "—" или "AI не рассчитан".
- Для отсутствующих рисков показывай нейтральное состояние "Нет прогноза".

Задача 7. Навигация.
- Каждая строка/карточка должна иметь ссылку на /sku/[id].
- Используй next/link.
- Не меняй страницу /sku/[id] в этой ветке.

Задача 8. Не ломай сборку, если Data API ещё нет.
Так как /api/sku может появиться после merge feature/data-api:
- fetch должен иметь try/catch;
- error state должен быть нормальным;
- build не должен зависеть от доступности API;
- не делай server-side fetch к /api/sku на build time.

Задача 9. Проверка качества.
Запусти:
- npm run lint
- npm run build

Затем dev server:
- npm run dev

Ручная проверка:
1. Открыть /login.
2. Войти demo / demo12345.
3. Перейти на /sku.
4. Убедиться, что header содержит Dashboard, SKU, Methodology, Выйти.
5. Убедиться, что catalog выглядит как готовый экран, даже если /api/sku пока не готов.
6. Проверить поиск/фильтры/сортировку, если данные доступны.
7. Проверить, что ссылки ведут на /sku/[id].
8. Проверить, что / и /methodology не изменены.
9. Проверить browser console: нет React/runtime errors.

После завершения покажи:
- список созданных/изменённых файлов;
- git diff --stat;
- результат npm run lint;
- результат npm run build;
- что /login/header не изменялись;
- что app/api, lib, supabase, types, dashboard, detail и shared components не изменялись.

Acceptance criteria:
- /sku выглядит как полноценный SKU catalog screen.
- Catalog UI использует SkuListResponse/SkuListItem из types/api.ts.
- UI готов к подключению /api/sku.
- Есть loading/error/empty/success states.
- Есть search/filter/sort.
- Есть переходы на /sku/[id].
- Нет fake demo data в TypeScript.
- Нет OpenRouter/Supabase вызовов из UI.
- Header не изменён и содержит Dashboard, SKU, Methodology, Выйти.
- /login не изменён.
- app/api/* не изменялись.
- lib/* не изменялись.
- components/ui/* не изменялись.
- components/dashboard/* не изменялись.
- app/(protected)/page.tsx не изменялся.
- app/(protected)/sku/[id]/page.tsx не изменялся.
- npm run lint проходит.
- npm run build проходит.
````

## Prompt 34 — Переход к карточке SKU после Data API, AI engine, Dashboard и Catalog
````text
Все этапы, описанные в прикрепленном текстовом файле, завершены. Можем приступать к следующему шагу.
````

## Prompt 35 — Claude: UI SKU Detail с AI-пересчётом
````text
Ты работаешь в проекте AIForecast, branch feature/ui-sku-detail, worktree AIForecast-ui-sku-detail.

Контекст проекта:
- Это MVP веб-сервиса для AI-прогнозирования запасов лекарственных средств.
- Следуй актуальному PROJECT_PLAN.md.
- Уже merged в feature/mvp:
  - Auth;
  - Supabase schema/demo data;
  - Data API;
  - AI forecast engine;
  - UI/API contracts;
  - UI Dashboard;
  - UI SKU Catalog.
- Header уже содержит Dashboard, SKU, Methodology и Выйти. Header не менять.
- /login остаётся отдельной страницей без protected header.
- Сейчас выполняется только UI SKU Detail.
- Backend/API/AI уже существуют. Не меняй их.
- Экран должен читать реальные данные из GET /api/sku/[id].
- Кнопка пересчёта должна вызывать POST /api/ai/forecast/[skuId].
- Не создавай mock/fake SKU, fake AI forecast или локальные demo data в TypeScript.

Главная цель:
Собрать законченную карточку SKU на /sku/[id], которая показывает паспорт SKU, партии, историю движения, forecast vs fact, AI-прогноз 1/3/6 месяцев, сезонность, тренд, аномалии, ROP/EOQ, риски, рекомендации и технические AI metadata. Экран должен уметь пересчитать AI-прогноз через существующий endpoint и обновить данные.

Разрешено менять:
- app/(protected)/sku/[id]/page.tsx
- components/sku/detail/*
- components/charts/sku/*

Можно использовать, но не менять без отдельного разрешения:
- components/ui/*
- components/charts/ChartContainer.tsx
- types/api.ts
- types/ai.ts
- types/inventory.ts

Запрещено менять:
- app/(protected)/layout.tsx
- app/(protected)/page.tsx
- app/(protected)/sku/page.tsx
- app/(protected)/methodology/page.tsx
- app/login/page.tsx
- app/api/*
- lib/*
- supabase/*
- components/dashboard/*
- components/sku/catalog/*
- components/charts/dashboard/*
- components/auth/*
- components/layout/*
- app/globals.css
- package.json
- package-lock.json
- PROJECT_PLAN.md
- PROMPTS.md
- README.md
- .env.example
- .env.local нельзя коммитить
- .claude/ нельзя коммитить

Задача 1. Изучи существующие контракты и UI:
1. Прочитай types/api.ts.
2. Прочитай types/ai.ts.
3. Прочитай types/inventory.ts.
4. Прочитай components/ui/*.
5. Прочитай components/charts/ChartContainer.tsx.
6. Прочитай app/(protected)/sku/[id]/page.tsx.
7. Посмотри стиль уже готовых dashboard и catalog компонентов, но не меняй их.

Задача 2. Обнови app/(protected)/sku/[id]/page.tsx.
- Это может быть server component-wrapper.
- Для Next.js 16 учитывай, что params может быть Promise<{ id: string }>, если текущий проект уже использует такой стиль.
- Страница должна передавать skuId в client component.
- Не делай Supabase/OpenRouter вызовов прямо в page.tsx.
- Основной fetch должен быть внутри client component через наши API endpoints.

Задача 3. Создай components/sku/detail/SkuDetailClient.tsx.
Компонент должен:
- быть client component;
- принимать skuId: string;
- делать fetch(`/api/sku/${skuId}`);
- поддерживать состояния:
  - loading;
  - 401 unauthorized / session expired;
  - 404 SKU not found;
  - generic error;
  - empty/no data;
  - success;
- использовать LoadingState, ErrorState, EmptyState из components/ui;
- не обращаться напрямую к Supabase;
- не обращаться напрямую к OpenRouter;
- не использовать fake data.

После успешной загрузки должен показывать блоки:
1. Header карточки SKU.
2. KPI/metrics.
3. Партии и сроки годности.
4. История движения.
5. Forecast vs fact.
6. AI forecast 1/3/6.
7. ROP/EOQ.
8. Риски.
9. Рекомендации.
10. Аномалии/сезонность/тренд.
11. Технический AI metadata.
12. Кнопка "Пересчитать AI-прогноз".

Задача 4. Создай UI-компоненты внутри components/sku/detail/.
Предлагаемая структура:
- SkuDetailHeader.tsx
- SkuDetailMetrics.tsx
- SkuLotsPanel.tsx
- SkuMovementsPanel.tsx
- SkuForecastPanel.tsx
- SkuReorderPanel.tsx
- SkuRiskPanel.tsx
- SkuRecommendationsPanel.tsx
- SkuAiInsightsPanel.tsx
- SkuAiMetadataPanel.tsx
- SkuRecalculateButton.tsx
- labels.ts
- formatters.ts

Можно изменить имена, если структура останется понятной.

Требования к UI:
- русский текст;
- аккуратная бизнес-подача;
- без перегруза;
- хорошие empty states, если AI forecast ещё не рассчитан;
- показать, что отсутствие AI-прогноза — это нормальное состояние до пересчёта;
- не скрывать кнопку пересчёта, если AI отсутствует;
- использовать RiskBadge для рисков;
- использовать KpiCard для ключевых метрик, если удобно;
- использовать ChartContainer для графиков.

Задача 5. Создай графики внутри components/charts/sku/.
Нужные графики:
1. MovementHistoryChart.tsx
   - Recharts;
   - показывает inbound/outbound/writeoff/ending stock по месяцам;
   - должен быть читаемым на карточке SKU.

2. SkuForecastVsFactChart.tsx
   - Recharts;
   - показывает fact/outbound и forecast, если forecast есть;
   - если AI forecast отсутствует, график должен показать только факт или корректный empty state;
   - не рисуй fake forecast.

3. LotExpiryChart.tsx или LotExpiryTimeline.tsx
   - визуализация партий по сроку годности;
   - можно сделать не график, а аккуратную timeline/table внутри detail components, если так быстрее и надёжнее.

Требования:
- не добавляй новые библиотеки;
- использовать уже установленный Recharts;
- избегать сложных кастомных tooltip types, если они ломают build;
- не задавай чрезмерно сложную типизацию tooltip formatter;
- если TypeScript конфликтует с Recharts formatter, используй более общий тип value: unknown и безопасное форматирование.

Задача 6. Реализуй кнопку пересчёта AI.
Компонент:
- components/sku/detail/SkuRecalculateButton.tsx

Поведение:
- POST `/api/ai/forecast/${skuId}`;
- body: { "force": true };
- после успеха обновить detail через повторный fetch;
- показать loading state на кнопке;
- показать успех/ошибку в UI;
- если API возвращает 401, показать сообщение о сессии;
- если OpenRouter вернул ошибку, показать понятное русское сообщение;
- не делать автоматический пересчёт при открытии страницы;
- не запускать batch endpoint.

Важно:
- Не вызывай AI на каждый render.
- Только по нажатию кнопки.
- После успеха новый forecast должен появиться в UI.

Задача 7. Отобрази AI-блоки.
Если latestAiForecast есть:
- forecast 1/3/6 месяцев;
- confidence;
- trend;
- seasonality;
- anomalies;
- executiveSummary;
- ROP;
- EOQ;
- safetyStock;
- leadTimeDemand;
- explanation;
- stockout/overstock/expiry risks;
- recommendations;
- metadata: model, createdAt, inputHash/status, если есть.

Если latestAiForecast нет:
- показать EmptyState:
  "AI-прогноз ещё не рассчитан"
  "Нажмите «Пересчитать AI-прогноз», чтобы вызвать OpenRouter и сохранить прогноз в Supabase."
- ROP/EOQ не придумывать;
- forecast не придумывать;
- рекомендации не придумывать.

Задача 8. Ручная навигация.
- В header ничего не меняй.
- Добавь в карточке ссылку "Назад к каталогу" на /sku.
- Можно добавить breadcrumb "SKU / Название препарата".
- Каждая строка catalog уже ведёт на /sku/[id], не меняй catalog.

Задача 9. Проверка качества.
Запусти:
- npm run lint
- npm run build

Запусти:
- npm run dev

Ручной smoke:
1. Открыть /login.
2. Войти demo / demo12345.
3. Открыть /sku.
4. Перейти в любой SKU.
5. Убедиться, что карточка загрузилась.
6. Проверить блоки: паспорт, партии, история движения, графики, AI-блоки.
7. Если SKU без AI-прогноза — увидеть empty state и кнопку пересчёта.
8. Нажать "Пересчитать AI-прогноз".
9. Убедиться, что кнопка показывает loading.
10. Убедиться, что после успеха UI обновился и появились forecast/ROP/EOQ/recommendations.
11. Открыть SKU с уже рассчитанным AI-прогнозом — блоки должны быть заполнены сразу.
12. Проверить, что в console нет ошибок.

После завершения покажи:
- список созданных/изменённых файлов;
- git diff --stat;
- результат npm run lint;
- результат npm run build;
- что именно проверено вручную;
- подтверждение, что .env.local не попал в git;
- подтверждение, что .claude/ не попал в git;
- подтверждение, что запрещённые файлы не изменялись.

Acceptance criteria:
- /sku/[id] показывает реальную карточку SKU из GET /api/sku/[id].
- Есть история движения и партии.
- Есть forecast vs fact.
- Есть AI forecast 1/3/6, если он рассчитан.
- Если AI forecast отсутствует, UI честно показывает empty state.
- Есть ROP/EOQ и explanation из AI, если forecast рассчитан.
- Есть риски и рекомендации из AI.
- Есть кнопка "Пересчитать AI-прогноз", которая вызывает существующий AI endpoint и обновляет UI.
- Нет fake AI data.
- Нет изменений API, lib, Supabase, Auth, shared UI, Dashboard, Catalog, Methodology.
- npm run lint проходит.
- npm run build проходит.
````

## Prompt 36 — Запуск methodology в параллельной фазе
````text
Запустила на выполнение feature/ui-sku-detail. Давай следующий шаг в параллель.
````

## Prompt 37 — Codex: UI Methodology page
````text
Ты работаешь в проекте AIForecast, branch feature/ui-methodology, worktree AIForecast-ui-methodology.

Контекст проекта:
- Это MVP веб-сервиса для AI-прогнозирования запасов лекарственных средств.
- Следуй актуальному PROJECT_PLAN.md.
- Уже завершены и merged в feature/mvp:
  - Auth;
  - Supabase schema/demo data;
  - UI/API contracts;
  - Data API;
  - AI forecast engine;
  - UI Dashboard;
  - UI SKU Catalog.
- Ветка feature/ui-sku-detail сейчас может выполняться параллельно. Не трогай файлы карточки SKU.
- Header авторизованной части уже содержит Dashboard, SKU, Methodology и Выйти. Header не менять.
- /login остаётся отдельной страницей без protected header.
- Сейчас выполняется только UI Methodology.
- Страница /methodology нужна для интервью: она должна объяснять бизнес-логику, AI-подход, ROP/EOQ, сезонность, тренды, аномалии, ограничения MVP и дальнейшее развитие.

Главная цель:
Собрать законченную страницу /methodology, которая помогает на демо объяснить, как работает AIForecast: какие данные используются, как AI строит прогноз, как появляются ROP/EOQ, риски и рекомендации, почему результаты кэшируются в Supabase, какие ограничения есть у MVP и как систему можно развить после тестового задания.

Разрешено менять:
- app/(protected)/methodology/page.tsx
- components/methodology/*

Можно использовать, но не менять без отдельного разрешения:
- components/ui/*
- components/charts/ChartContainer.tsx
- types/api.ts
- types/ai.ts
- types/inventory.ts

Запрещено менять:
- app/(protected)/layout.tsx
- app/(protected)/page.tsx
- app/(protected)/sku/page.tsx
- app/(protected)/sku/[id]/page.tsx
- app/login/page.tsx
- app/api/*
- lib/*
- supabase/*
- components/dashboard/*
- components/sku/*
- components/charts/dashboard/*
- components/charts/sku/*
- components/auth/*
- components/layout/*
- app/globals.css
- package.json
- package-lock.json
- PROJECT_PLAN.md
- PROMPTS.md
- README.md
- .env.example
- .env.local нельзя коммитить

Задача 1. Изучи контекст.
Прочитай:
- PROJECT_PLAN.md
- TASK_DESCRIPTION.md
- types/ai.ts
- types/api.ts
- components/ui/*
- текущий app/(protected)/methodology/page.tsx

Обязательно учти требования задания:
- AI-прогноз на 1/3/6 месяцев;
- сезонность, тренды и аномалии;
- ROP/EOQ с объяснением параметров;
- ранние предупреждения о дефиците и затоваривании;
- рекомендации: перезаказать / ускорить реализацию / списать;
- dashboard: ABC-анализ, дни покрытия, forecast vs fact.

Задача 2. Обнови app/(protected)/methodology/page.tsx.
Страница может быть server component.
Она должна рендерить полноценный methodology screen.
Не делай fetch к API.
Не обращайся к Supabase.
Не обращайся к OpenRouter.
Не добавляй client component без необходимости.

Задача 3. Создай компоненты в components/methodology/.
Предлагаемая структура:
- MethodologyHero.tsx
- MethodologyDataFlow.tsx
- MethodologyAiApproach.tsx
- MethodologyForecasting.tsx
- MethodologyReorder.tsx
- MethodologyRisks.tsx
- MethodologyMvpLimitations.tsx
- MethodologyRoadmap.tsx
- MethodologySection.tsx
- methodology-content.ts

Можно изменить имена, если структура останется понятной.

Задача 4. Содержание страницы.
Страница должна включать блоки:

1. Hero:
   - название: "Методология AIForecast"
   - подзаголовок: как сервис помогает управлять запасами ЛС через AI-прогнозирование.

2. Data flow:
   Объяснить цепочку:
   - Supabase demo data;
   - SKU;
   - партии и сроки годности;
   - движения приход/расход/списания;
   - Next.js API;
   - OpenRouter AI;
   - сохранённый forecast;
   - UI dashboard/catalog/detail.

3. Что получает AI:
   - паспорт SKU;
   - текущий остаток;
   - партии;
   - сроки годности;
   - 18 месяцев истории движения;
   - приходы;
   - расходы;
   - списания;
   - lead time;
   - стоимость;
   - условия хранения;
   - сезонный контекст;
   - аномалии.

4. Как строится прогноз:
   - forecast на 1/3/6 месяцев;
   - сезонность;
   - тренды;
   - аномалии;
   - confidence;
   - почему прогноз сохраняется в Supabase и не пересчитывается на каждый рендер.

5. ROP/EOQ:
   Объяснить простым языком:
   - ROP — точка, когда нужно перезаказывать;
   - EOQ — экономически рациональный размер заказа;
   - AI возвращает ROP/EOQ и объяснение параметров;
   - код валидирует structured JSON и не допускает невозможные значения.

6. Риски:
   - дефицит;
   - затоваривание;
   - списание из-за срока годности;
   - аномалии;
   - примеры сообщений на русском.

7. Рекомендации:
   - перезаказать;
   - ускорить реализацию;
   - списать;
   - мониторить;
   - скорректировать страховой запас.

8. Что показывает UI:
   - dashboard;
   - catalog;
   - SKU detail;
   - AI recalculation button.

9. Ограничения MVP:
   - данные синтетические;
   - auth демонстрационная;
   - ERP/WMS/MES не подключены;
   - локальный Supabase через Docker не используется;
   - AI-рекомендации требуют бизнес-валидации перед production;
   - это MVP для демонстрации подхода.

10. Roadmap после MVP:
   - подключение ERP/WMS/MES;
   - роли пользователей;
   - RLS и production auth;
   - real-time alerts;
   - audit trail;
   - approval workflow для закупок;
   - расширенная аналитика качества прогноза.

Задача 5. Визуальные требования.
- Русский язык.
- Аккуратная презентационная подача.
- Страница должна хорошо смотреться на интервью.
- Используй карточки, секции, списки, небольшие бейджи.
- Можно использовать KpiCard, EmptyState или другие existing UI components, но не менять их.
- Не добавляй новые зависимости.
- Не используй сложные графики: методология должна быть стабильной и не ломать build.
- Не делать чрезмерно длинные абзацы.
- Текст должен быть понятен человеку с бизнес-бэкграундом, не только разработчику.

Задача 6. Не меняй текущие маршруты и header.
Проверь:
- /methodology остаётся внутри protected layout.
- Header не изменён.
- Dashboard/SKU/Methodology/Выйти остаются как есть.
- /login не затронут.

Задача 7. Проверка качества.
Запусти:
- npm run lint
- npm run build

После завершения покажи:
- список созданных/изменённых файлов;
- git diff --stat;
- результат npm run lint;
- результат npm run build;
- подтверждение, что .env.local не попал в git;
- подтверждение, что запрещённые файлы не изменялись.

Acceptance criteria:
- /methodology выглядит как законченная страница продукта.
- Страница объясняет AI-подход, данные, прогноз, ROP/EOQ, риски, рекомендации, ограничения MVP и roadmap.
- Нет fetch/API/Supabase/OpenRouter вызовов.
- Нет fake runtime data.
- Нет изменений API, lib, Supabase, Auth, Dashboard, Catalog, SKU Detail.
- npm run lint проходит.
- npm run build проходит.
````

## Prompt 38 — Завершение UI Methodology
````text
Завершила создание и смержила feature/ui-methodology. Теперь давай перейдем к генерации документации.
````

## Prompt 39 — Генерация документации
````text
Ты работаешь в проекте AIForecast, branch feature/docs.

Контекст:
- Это MVP веб-сервиса AIForecast для AI-прогнозирования запасов лекарственных средств.
- Следуй актуальному PROJECT_PLAN.md.
- Все feature-ветки уже вмерджены в текущую ветку feature/docs:
  - Auth;
  - Supabase schema/demo data;
  - UI/API contracts;
  - Data API;
  - AI forecast engine;
  - UI Dashboard;
  - UI SKU Catalog;
  - UI SKU Detail;
  - UI Methodology.
- Методология была вмерджена поздно, поэтому README.md нужно собрать заново с учётом уже фактически готового приложения.
- PROMPTS.md НЕ МЕНЯТЬ.
- Production URL может быть ещё неизвестен. Если URL неизвестен, оставь placeholder: TBD после Vercel deploy.

Главная цель:
Актуализировать только README.md как финальный отчётный документ для сдачи тестового задания. README должен описывать готовый продукт, архитектуру, стек, AI-подход, данные, запуск, Supabase setup, OpenRouter setup, demo flow, деплой и ограничения MVP.

Разрешено менять только:
- README.md

Запрещено менять:
- PROMPTS.md
- PROJECT_PLAN.md
- TASK_DESCRIPTION.md
- ENVIROMENT.md
- app/**
- components/**
- lib/**
- types/**
- supabase/**
- package.json
- package-lock.json
- next.config.ts
- proxy.ts
- .env.example
- .env.local
- AGENTS.md
- CLAUDE.md
- .claude/
- любые production-code файлы

Перед написанием README изучи, но не меняй:
- PROJECT_PLAN.md
- TASK_DESCRIPTION.md
- ENVIROMENT.md
- package.json
- app/**
- app/api/**
- components/**
- lib/ai/**
- lib/dashboard/**
- lib/sku/**
- types/api.ts
- types/ai.ts
- types/inventory.ts
- supabase/migrations/001_init_schema.sql
- supabase/seed.sql

Важно:
- Не меняй файлы, которые читаешь.
- Не добавляй новые зависимости.
- Не меняй production code.
- Не меняй PROMPTS.md.
- Не меняй env-файлы.
- README.md должен быть на русском языке.

Структура README.md:

1. Название проекта

AIForecast — AI-прогнозирование запасов лекарственных средств

2. Краткое описание

Опиши, что это MVP веб-сервиса для фармацевтической компании полного цикла, который помогает:
- прогнозировать потребность;
- выявлять риски дефицита;
- выявлять риски затоваривания;
- учитывать сроки годности;
- рассчитывать ROP/EOQ;
- получать AI-рекомендации по действиям.

3. Ссылки

Добавь:
- GitHub repository: https://github.com/Otto1Koester/AIForecast
- Production URL: TBD после Vercel deploy
- Demo login:
  - username: demo
  - password: demo12345

Если в проекте уже есть production URL в env/docs, используй его. Если нет — оставь placeholder.

4. Основные возможности

Опиши готовые возможности:
- простая demo-авторизация;
- защищённые страницы;
- Dashboard;
- SKU catalog;
- SKU detail;
- Methodology;
- Supabase demo data;
- Data API;
- OpenRouter AI forecast;
- AI forecast caching в Supabase;
- ручной пересчёт AI-прогноза на карточке SKU.

5. Стек

Перечисли:
- Next.js App Router;
- React;
- TypeScript;
- Tailwind CSS;
- Recharts;
- Supabase Cloud Postgres;
- OpenRouter API;
- Vercel;
- GitHub.

6. Архитектура

Добавь текстовую схему:

User
→ Next.js App Router UI
→ Next.js Route Handlers in app/api
→ Supabase Cloud Postgres
→ OpenRouter AI
→ ai_forecasts / ai_forecast_runs
→ Dashboard / Catalog / SKU Detail

Объясни:
- отдельного backend-сервиса нет;
- backend живёт внутри app/api;
- Supabase service role key используется только server-side;
- OpenRouter вызывается только server-side;
- UI не получает секреты.

7. Страницы приложения

Опиши:
- /login — demo auth;
- / — dashboard;
- /sku — catalog;
- /sku/[id] — detail card;
- /methodology — объяснение подхода.

Для каждой страницы добавь 2–4 предложения о том, что она показывает.

8. API endpoints

Опиши:
- POST /api/auth/login;
- POST /api/auth/logout;
- GET /api/auth/me;
- GET /api/dashboard;
- GET /api/sku;
- GET /api/sku/[id];
- POST /api/ai/forecast/[skuId];
- POST /api/ai/forecast/batch.

9. Данные и Supabase

Опиши таблицы:
- app_users;
- sku_items;
- inventory_lots;
- inventory_movements;
- ai_forecasts;
- ai_forecast_runs.

Укажи:
- данные синтетические;
- хранятся в Supabase Cloud;
- локальный Supabase через Docker не используется;
- SQL schema и seed лежат в репозитории;
- demo dataset закрывает разные сценарии: дефицит, затоваривание, сезонность, аномалии, срок годности.

10. AI-подход

Объясни:
- AI является forecast/decision engine;
- OpenRouter получает structured SKU context;
- AI возвращает structured JSON;
- результат валидируется;
- результат сохраняется в Supabase;
- UI читает сохранённый forecast;
- AI не вызывается на каждый render;
- ручной пересчёт делается кнопкой на карточке SKU.

Отдельно перечисли, что AI возвращает:
- forecast 1/3/6 месяцев;
- сезонность;
- тренд;
- аномалии;
- ROP;
- EOQ;
- риски;
- рекомендации;
- confidence;
- executive summary.

11. Environment variables

Добавь блок:

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

Укажи:
- .env.local не коммитить;
- service role key не должен попадать в browser;
- OpenRouter key не должен попадать в browser;
- env values нужно добавить и локально, и в Vercel.

12. Локальный запуск

Добавь команды для Windows PowerShell:

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Укажи, что после копирования .env.local нужно заполнить Supabase/OpenRouter/JWT значения.

13. Supabase setup

Опиши:
1. создать Supabase Cloud project;
2. открыть SQL Editor;
3. выполнить supabase/migrations/001_init_schema.sql;
4. выполнить supabase/seed.sql;
5. проверить demo user и demo data;
6. заполнить env variables.

Добавь проверочный SQL:

```sql
select
  (select count(*) from app_users) as app_users,
  (select count(*) from sku_items) as sku_items,
  (select count(*) from inventory_lots) as inventory_lots,
  (select count(*) from inventory_movements) as inventory_movements,
  (select count(*) from ai_forecasts) as ai_forecasts,
  (select count(*) from ai_forecast_runs) as ai_forecast_runs;
```

14. OpenRouter setup

Опиши:
- нужен OPENROUTER_API_KEY;
- модель задаётся через OPENROUTER_MODEL;
- по умолчанию используется openai/gpt-4o-mini;
- AI forecast вызывается через server-side endpoint;
- batch endpoint можно использовать для подготовки demo data.

15. Демо-сценарий

Опиши пошагово:
1. открыть приложение;
2. войти demo / demo12345;
3. посмотреть Dashboard;
4. открыть SKU catalog;
5. применить фильтры/сортировку;
6. открыть SKU detail;
7. посмотреть партии, историю движения, forecast vs fact;
8. нажать "Пересчитать AI-прогноз";
9. показать AI forecast 1/3/6, ROP/EOQ, риски и рекомендации;
10. открыть Methodology.

16. Деплой на Vercel

Опиши:
1. подключить GitHub repo;
2. выбрать проект;
3. добавить env variables;
4. выполнить deploy;
5. проверить /login, /, /sku, /sku/[id], /methodology;
6. проверить AI recalculation;
7. заменить placeholder Production URL в README.

17. Команды качества

Добавь:

```powershell
npm run lint
npm run build
```

18. Ограничения MVP

Укажи:
- данные синтетические;
- auth демонстрационная;
- ERP/WMS/MES не подключены;
- локальный Supabase через Docker не используется;
- AI-рекомендации требуют бизнес-валидации перед production;
- приложение демонстрирует подход, а не промышленную ERP-систему.

19. Принятые решения

Кратко перечисли:
- Next.js full-stack без отдельного backend;
- Supabase Cloud;
- OpenRouter;
- structured JSON;
- AI forecast caching;
- git worktree для параллельной разработки;
- Vercel deploy.

20. Структура проекта

Добавь краткое дерево:
- app;
- components;
- lib;
- types;
- supabase;
- README.md;
- PROMPTS.md;
- PROJECT_PLAN.md.

Финальная проверка:
1. После правки README.md выполни:
   - git diff --stat
   - git diff --name-only
2. Убедись, что изменён только README.md.
3. Если изменился PROMPTS.md — откати его.
4. Если изменился production code — откати его.
5. Проверь, что .env.local не отслеживается.
6. Можно запустить npm run lint и npm run build, но если менялся только README.md, это необязательно.

После завершения покажи:
- какие разделы README обновлены;
- git diff --stat;
- git diff --name-only;
- подтверждение, что изменён только README.md;
- подтверждение, что PROMPTS.md не менялся;
- подтверждение, что production code не менялся;
- подтверждение, что .env.local не попал в git.

Acceptance criteria:
- README.md актуален с учётом всех merged features, включая methodology.
- README.md готов для интервью и сдачи тестового задания.
- PROMPTS.md не изменён.
- Production code не изменён.
- Production URL оставлен как placeholder, если деплоя ещё нет.
````

## Prompt 40 — Переход к final polish после завершения всех feature-веток
````text
feature/ui-sku-detail, feature/ui-methodology и feature/docs завершены, все ветки смержены в feature/mvp, проект собирается, ошибок нет, можем переходить к следующему шагу
````

## Prompt 41 — Cursor: final polish и интеграционный smoke-test MVP
````text
Ты работаешь в проекте AIForecast, branch feature/final-polish.

Контекст:
- Все основные ветки уже merged в feature/mvp:
  - data-api
  - ai-engine
  - ui-dashboard
  - ui-sku-catalog
  - ui-sku-detail
  - ui-methodology
  - docs
- Сейчас выполняется только final polish / integration QA.
- Главная задача — проверить связность приложения целиком и исправить только реальные интеграционные проблемы.
- Не переписывай архитектуру.
- Не добавляй новые крупные функции.
- Не меняй Supabase schema без крайней необходимости.
- Не меняй README/PROMPTS без отдельного решения, если там нет явной ошибки.

Продуктовый flow, который должен работать:
1. /login
2. login demo / demo12345
3. /
4. /sku
5. /sku/[id]
6. POST /api/ai/forecast/[skuId] через кнопку "Пересчитать AI-прогноз"
7. /methodology
8. logout

Обязательные требования:
- Header авторизованной части содержит Dashboard, SKU, Methodology, Выйти.
- /login без protected header.
- Данные берутся из Supabase через Next.js API, не из TypeScript mock.
- AI-прогноз реально вызывается через OpenRouter только по кнопке или batch endpoint.
- UI не должен показывать fake AI forecast.
- Если AI-прогноз отсутствует, UI честно показывает empty state.
- Если AI-прогноз есть, dashboard/catalog/detail должны показывать AI-поля.
- Service role key и OpenRouter key не должны попадать в клиентский код.
- .env.local не должен быть tracked.
- .claude/, временные debug-файлы и тестовые одноразовые скрипты не должны попасть в git.

Разрешено менять:
- интеграционные багфиксы в app/(protected)/*
- интеграционные багфиксы в components/*
- интеграционные багфиксы в app/api/*
- интеграционные багфиксы в lib/*
- небольшие исправления types/*
- небольшие исправления README.md или PROMPTS.md только если они явно устарели после merge
- удаление случайных временных файлов, если они tracked

Запрещено:
- не менять PROJECT_PLAN.md
- не добавлять новые зависимости без крайней необходимости
- не менять package.json/package-lock.json без объяснения
- не добавлять mock data
- не добавлять fake ai_forecasts
- не отключать auth
- не отключать lint/typecheck
- не коммитить .env.local
- не коммитить .claude/

Задача 1. Проверка структуры и мусора.
Проверь:
- git status
- git ls-files .env.local
- git ls-files .claude
- git ls-files | findstr /i "test debug temp"
- нет ли случайного test-supabase.js, если он не нужен продукту
- нет ли console.log с секретами или лишним debug

Если найдёшь мусор:
- удали только очевидные временные файлы;
- не удаляй полезные SQL/scripts/docs без уверенности.

Задача 2. Проверка build/lint/typecheck.
Запусти:
- npm run lint
- npm run build

Исправь ошибки, если есть.
Если ошибок нет — ничего не меняй ради красоты.

Задача 3. Проверка API через local dev.
Запусти npm run dev.

Проверь через PowerShell или браузер:
1. POST /api/auth/login с demo / demo12345.
2. GET /api/auth/me с cookie.
3. GET /api/dashboard с cookie.
4. GET /api/sku с cookie.
5. GET /api/sku/[id] с cookie.
6. POST /api/ai/forecast/[skuId] с body { "force": true }.
7. Повтор POST без force или с force:false, если endpoint поддерживает, чтобы проверить cache.
8. POST /api/auth/logout.
9. GET /api/dashboard без cookie должен вернуть 401.

Не выводи секреты в лог.

Задача 4. Проверка UI flow.
Проверь вручную в браузере:
1. /login открывается без header.
2. Неверный пароль показывает ошибку.
3. demo / demo12345 логинит.
4. / показывает dashboard без console errors.
5. Header содержит Dashboard, SKU, Methodology, Выйти.
6. Dashboard показывает KPI, AI status, ABC, coverage, forecast vs fact, top risks.
7. /sku показывает каталог, фильтры, сортировку и переходы.
8. /sku/[id] показывает паспорт SKU, партии, движение, графики, AI-блоки.
9. Кнопка "Пересчитать AI-прогноз" вызывает AI endpoint, показывает loading/success/error и обновляет UI.
10. /methodology открывается и выглядит как законченная страница.
11. Выйти переводит на /login.
12. После logout прямой заход на /sku возвращает на /login.

Задача 5. Проверка responsive.
Минимально проверь:
- desktop ширина;
- mobile ширина около 390px;
- таблица SKU не ломает экран;
- карточка SKU читаема;
- dashboard не имеет горизонтального overflow.

Задача 6. Проверка содержания README/PROMPTS.
Проверь:
- README содержит описание, архитектуру, стек, запуск, env variables, demo credentials, ограничения MVP, demo flow.
- README не содержит реальных ключей.
- PROMPTS.md существует и соответствует формату проекта.
- Если README уже готов и не содержит ошибок — не переписывай.

Задача 7. Demo readiness.
Подготовь короткий список:
- какие SKU лучше показать на демо;
- у какого SKU уже есть AI forecast;
- какой SKU можно использовать для кнопки "Пересчитать AI-прогноз";
- есть ли смысл запустить batch forecast для 3–5 SKU перед деплоем.

Если нужно запустить batch forecast:
- сначала предложи команду/endpoint;
- не запускай бесконтрольно на все SKU;
- соблюдай AI_BATCH_LIMIT.

После завершения покажи:
- список найденных проблем;
- что исправлено;
- список изменённых файлов;
- git diff --stat;
- результаты npm run lint;
- результаты npm run build;
- результаты ручного smoke-test;
- рекомендации перед деплоем.
````

## Prompt 42 — Переход к деплою после final polish
````text
Этап final-polish завершен. Переходим к следующему шагу.
````

## Prompt 43 — Подготовка промта для исправления UI в Claude Code
````text

Давай наведем красоту в нашем UI. На главной странице добавить наименование задания: AI-прогнозирование лекарственных средств. Все английские слова необходимо перевести на русский (можно только оставить аббревиатуры SKU - товарная позиция, AI). Класс ABC - должны быть разные цвета для А, B, C на всех страницах по одному принципу. На странице Каталог SKU убрать из таблицы кнопки "Открыть", а переход на страницу препарата осуществляется при клике на всю строку.

Объясни, как ты понял задание и сформулируй промт для Claud Code для фиксации моих замечаний
````

## Prompt 44 — Исправление UI
````text
Ты работаешь в проекте AIForecast — Next.js App Router / React / TypeScript / Tailwind CSS MVP для AI-прогнозирования запасов лекарственных средств.

Задача: выполнить UI-polish по замечаниям пользователя. Это только визуальная и текстовая доработка интерфейса. Не меняй backend, API route handlers, Supabase schema, seed/demo data, AI engine, env-файлы, бизнес-логику и расчёты.

Контекст проекта:
- Страница авторизации: app/login/page.tsx и components/auth/*
- Главная страница: app/(protected)/page.tsx и components/dashboard/*
- Каталог SKU: app/(protected)/sku/page.tsx и components/sku/catalog/*
- Карточка SKU: app/(protected)/sku/[id]/page.tsx и components/sku/detail/*
- Общий protected layout/header: app/(protected)/layout.tsx и/или components/layout/*
- Shared components: components/ui/*

Важно:
- Shared components в components/ui/* меняй только если это минимально необходимо для единого отображения ABC-классов или уже существующего badge/helper.
- Не меняй API contracts в types/api.ts без крайней необходимости.
- Не добавляй fake/mock data.

Нужно сделать:

1. Страница авторизации /login

Добавь на страницу авторизации видимое наименование задания:

"AI-прогнозирование лекарственных средств"

Размести его аккуратно в верхнем/центральном блоке login screen рядом с названием продукта или описанием, чтобы при открытии приложения сразу было понятно, что это тестовое задание про AI-прогнозирование лекарственных средств.

Не добавляй это название на главную страницу, если его там ещё нет. Основное место размещения — именно /login.

2. Русификация интерфейса

Найди все видимые пользователю английские слова и фразы в UI и переведи их на русский на страницах:

- /login
- /
- /sku
- /sku/[id]
- /methodology
- общий header/navigation/layout
- loading/error/empty states, если там есть английский текст

Разрешено оставить без перевода только аббревиатуры:

- AI
- SKU
- ROP
- EOQ

Все остальные пользовательские подписи, заголовки, кнопки, фильтры, статусы, тултипы, empty/error messages и навигационные элементы должны быть на русском.

Примеры переводов:
- Dashboard → Дашборд или Главная
- SKU Catalog → Каталог SKU
- Methodology → Методология
- Logout → Выйти
- Forecast vs fact → Прогноз и факт
- Risk → Риск
- Recommendation → Рекомендация
- Stockout → Дефицит
- Overstock → Затоваривание
- Expiry risk → Риск срока годности
- Current stock → Текущий остаток
- Days coverage → Дни покрытия
- AI alerts → AI-алерты
- Confidence → Уверенность
- Last updated → Последнее обновление
- Open → Открыть, но в каталоге SKU отдельную кнопку "Открыть" нужно удалить по пункту 4

Технические аббревиатуры ROP и EOQ оставляй как есть, но поясняющий текст вокруг них должен быть на русском.

3. Денежные единицы не менять

Не меняй денежные единицы, валютные символы и формат денежных значений.

Не делай:
- конвертацию в рубли;
- замену $, USD, EUR или других валют;
- пересчёт по курсу;
- изменение seed/API ради валют.

Если найдёшь денежные значения в UI, оставь текущие единицы измерения как есть.

4. Единые цвета для ABC-классов

Сделай единый принцип цветового отображения ABC-классов на всех страницах, где они встречаются:

- Dashboard
- Каталог SKU
- Карточка SKU, если класс там отображается

Требования:
- класс A всегда отображается одним цветом;
- класс B всегда отображается вторым цветом;
- класс C всегда отображается третьим цветом;
- стили должны быть визуально различимыми и аккуратными;
- желательно использовать единый helper/component, если он уже существует;
- если создаёшь/меняешь shared component для ABC badge, сделай это минимально и объясни в конце.

Пример допустимой логики:
- A: красный/rose оттенок как самый важный класс
- B: amber/yellow оттенок
- C: emerald/green или slate/blue оттенок

Конкретные цвета можешь подобрать сам, главное — единообразие на всех страницах.

5. Каталог SKU: переход по клику на строку

На странице /sku убери из таблицы отдельные кнопки "Открыть".

Вместо этого сделай переход на страницу препарата по клику на всю строку таблицы.

Требования:
- вся строка таблицы кликабельна;
- при hover видно, что строка интерактивная;
- используй cursor-pointer;
- переход ведёт на /sku/[id] соответствующей товарной позиции;
- не ломай поиск, фильтры, сортировку и отображение таблицы;
- если есть mobile card view, убери там дублирующую кнопку "Открыть", если она есть, и сохрани переход в карточку препарата через клик по карточке или явно понятную интерактивную область.

6. Проверка после изменений

После правок проверь:

- нет видимых английских пользовательских строк в изменённых UI-файлах, кроме AI, SKU, ROP, EOQ;
- денежные единицы остались как были;
- кнопки "Открыть" в таблице каталога SKU больше нет;
- переход в карточку SKU работает по клику на строку;
- ABC-классы имеют единые цвета на всех страницах;
- TypeScript не сломан.

Не меняй:
- app/api/*
- lib/ai/*
- lib/supabase/*
- supabase/*
- .env*
- seed/demo data
- OpenRouter logic
- auth backend logic

В конце ответа дай:
1. Список изменённых файлов.
2. Краткое описание исправлений.
3. Какие английские аббревиатуры оставлены намеренно.
4. Подтверждение, что валюты не менялись.
5. Команды для проверки.
````

## Prompt 45 — Подготовка промта для Claude Code по локализации
````text
Обрати внимание, что остались элементы на английском языке, которые необходимо перевести на русский. Изучи картинки и объясни, как ты понял, что нужно поправить. Составь промт для Claude Code
````

## Prompt 46 — Исправление UI
````text
Ты работаешь в проекте AIForecast — Next.js App Router / React / TypeScript / Tailwind CSS MVP для AI-прогнозирования запасов лекарственных средств.

Предыдущая русификация UI выполнена не полностью. По скриншотам видно, что в интерфейсе всё ещё остались английские пользовательские строки, единицы измерения и fallback-тексты. Нужно довести локализацию до конца.

Это только UI-polish. Не меняй backend, API route handlers, Supabase schema, seed/demo data, AI engine, env-файлы, бизнес-логику, расчёты и валюты.

Важно:
- Валюты НЕ менять. USD остаётся USD.
- Денежные значения НЕ пересчитывать.
- Аббревиатуры AI, SKU, ABC, ROP, EOQ можно оставлять как есть.
- Все остальные видимые пользователю английские слова и фразы нужно перевести на русский.
- Не добавляй fake/mock data.
- Не меняй API contracts без крайней необходимости.

Проверь и исправь UI на страницах:
- /login
- /
- /sku
- /sku/[id]
- /methodology
- общий layout/header/navigation
- loading/error/empty/fallback states

Особое внимание удели следующим местам, которые остались на английском по скриншотам:

1. KPI-карточки на странице SKU detail

Нужно заменить:
- Current stock → Текущий остаток
- Inventory value → Стоимость запасов
- Days coverage → Дни покрытия
- Expiry risk → Риск срока годности

Нужно заменить описания:
- Reference metric based on historical outbound movements.
  → Справочная метрика на основе исторического расхода.

- Quantity in lots expiring within 90 days.
  → Количество в партиях со сроком годности в ближайшие 90 дней.

2. KPI-карточки на dashboard

Нужно заменить:
- Total SKU → Всего SKU
- Stockout risk → Риск дефицита
- Overstock risk → Риск затоваривания
- Expiry risk → Риск срока годности
- Inventory value → Стоимость запасов
- Potential write-off → Потенциальное списание

Нужно заменить описания:
- High or critical risk from latest AI forecasts.
  → Высокий или критический риск по последним AI-прогнозам.

- AI risk when available, otherwise near-expiry lot reference.
  → AI-риск при наличии прогноза, иначе справочная оценка по партиям с близким сроком годности.

- Reference value in lots expiring within 180 days.
  → Справочная стоимость партий со сроком годности в ближайшие 180 дней.

3. Блок "Топ SKU по риску"

Нужно заменить fallback/recommendation text:
- AI forecast is not generated yet; this is a reference watch item based on stock coverage or lot expiry.
  → AI-прогноз ещё не рассчитан; это справочная позиция для контроля на основе дней покрытия или срока годности партии.

Также проверь все похожие fallback-строки, где говорится, что AI forecast ещё не generated/calculated/available, и переведи их на русский.

4. Единицы измерения товарных остатков

По скриншотам в таблице остались английские единицы:
- syringe
- pen
- pack

Нужно отображать их на русском во всех UI-местах, где показывается количество SKU/остаток/партия/расход/приход/списание.

Минимальная мапа единиц:
- syringe → шприц.
- pen → ручка
- pack → упак.
- tablet → табл.
- capsule → капс.
- vial → флак.
- ampoule → амп.
- bottle → фл.
- dose → доза
- unit → ед.

Если в проекте уже есть util/formatter для единиц — используй его.
Если нет — создай небольшой UI-helper, например formatUnitRu(unit: string), в безопасном месте:
- либо рядом с UI-компонентом,
- либо в lib/utils/format.ts, если там уже есть форматтеры.

Не меняй seed.sql и API ради перевода единиц. Перевод должен быть на уровне отображения UI.

Примеры:
- 28 syringe → 28 шприц.
- 150 pen → 150 ручка
- 260 pack → 260 упак.
- 148,1 days → 148,1 дн.

5. Дни

Замени видимое слово days на русский вариант:
- days → дн.
- если используется в тексте, переводи по смыслу: дней.

Примеры:
- 148,1 days → 148,1 дн.
- 126.8 дн. лучше привести к русскому числовому формату, если рядом уже используется запятая: 126,8 дн.

6. Поиск оставшегося английского текста

Сделай поиск по проекту в UI-файлах на английские пользовательские слова и исправь найденные строки.

Ищи минимум по словам:
- Current
- Inventory
- Days
- Expiry
- Total
- Stockout
- Overstock
- Potential
- write-off
- Reference
- Quantity
- latest
- forecasts
- generated
- available
- based
- coverage
- expiry
- stock
- risk
- recommendation
- Open
- Loading
- Error
- Empty
- No data
- Search
- Filter
- Sort
- Reset
- Details
- View

Не нужно переводить:
- имена переменных;
- TypeScript-типы;
- ключи JSON;
- API fields;
- route names;
- CSS class names;
- технические названия библиотек;
- аббревиатуры AI, SKU, ABC, ROP, EOQ.

7. Каталог SKU

Проверь, что в каталоге SKU:
- кнопки "Открыть" в таблице нет;
- переход в карточку препарата работает по клику на всю строку;
- в mobile card view нет лишнего английского текста;
- единицы измерения остатков отображаются на русском;
- hover/cursor-pointer для кликабельных строк сохранены.

8. Страница авторизации

Проверь, что на /login есть название задания:
"AI-прогнозирование лекарственных средств"

Если его нет — добавь аккуратно рядом с названием продукта/описанием.

9. Проверка результата

После изменений проверь:
- нет видимых английских пользовательских строк в UI, кроме AI, SKU, ABC, ROP, EOQ и USD;
- USD остался без изменений;
- единицы измерения остатков переведены на русский на dashboard, catalog и detail;
- кнопка "Открыть" в таблице SKU отсутствует;
- переход в SKU detail по клику на строку работает;
- ABC-классы сохраняют единый цветовой принцип;
- TypeScript не сломан.

Не меняй:
- app/api/*
- lib/ai/*
- lib/supabase/*
- supabase/*
- .env*
- seed/demo data
- OpenRouter logic
- auth backend logic

В конце ответа дай:
1. Список изменённых файлов.
2. Что именно было переведено.
3. Какие английские аббревиатуры оставлены намеренно.
4. Подтверждение, что валюты не менялись.
5. Подтверждение, что единицы измерения переведены на уровне UI, без изменения данных.
6. Команды для проверки.
````

## Prompt 47 — Подготовка промта для исправления валюты
````text
Давай исправим денежные единицы на рубли с конвертацией по текущему курсу. Напиши мне промт для агента, который по твоему усмотрению лучше всего справится с этой задачей, при этом не навредит приложению
````

## Prompt 48 — Исправление валюты в Codex
````text
Ты работаешь в проекте AIForecast — Next.js App Router / React / TypeScript / Tailwind CSS MVP для AI-прогнозирования запасов лекарственных средств.

Задача: аккуратно заменить отображение денежных единиц с USD на рубли с конвертацией по текущему курсу, не навредив приложению.

Исполнитель: Codex.
Причина: задача затрагивает форматирование денежных значений, возможные shared utilities, TypeScript-типы и UI-consumers. Нужно сделать точный безопасный refactor.

Контекст:
- Приложение уже работает.
- Данные хранятся в Supabase.
- UI получает данные через Next.js API.
- Нельзя ломать API, AI engine, Supabase schema, seed и auth.
- Это должна быть безопасная доработка отображения денежных значений.

Текущий курс для конвертации:
- 1 USD = 74.6947 RUB
- Источник курса: официальный курс ЦБ РФ на 29.04.2026.
- В коде добавь комментарий рядом с константой курса:
  "CBR official USD/RUB rate for 2026-04-29. Used for demo UI currency conversion."

Главный принцип:
- НЕ меняй данные в Supabase.
- НЕ меняй seed.sql.
- НЕ меняй migrations.
- НЕ меняй API contracts, если можно решить на уровне UI/formatters.
- Денежные значения, которые приходят как USD, нужно конвертировать в RUB только при отображении в UI.
- Если где-то значение уже считается как производное в UI, конвертируй итоговое денежное значение перед отображением.
- Если где-то есть строка "USD", "$" или английский currency label — заменить отображение на рубли.
- Если значение не является денежным, не трогать.

Что нужно сделать:

1. Найти все места, где в UI отображаются деньги

Ищи по проекту:
- USD
- $
- currency
- Inventory value
- Potential write-off
- unitCost
- inventoryValue
- potentialWriteOff
- writeOff
- cost
- value
- price
- formatCurrency
- Intl.NumberFormat
- maximumFractionDigits

Особенно проверь:
- dashboard KPI cards
- SKU catalog table/cards
- SKU detail KPI cards
- lots / партии
- ROP/EOQ блоки, если там есть денежные значения
- recommendation cards, если там выводится стоимость
- charts/tooltips, если там есть денежные значения

2. Создать или обновить единый formatter валюты

Если в проекте уже есть файл форматтеров, например:
- lib/utils/format.ts
- lib/utils/formatters.ts
- components/utils/*
используй его.

Если такого файла нет, создай безопасный util, например:
- lib/utils/format.ts

Добавь:
- константу USD_TO_RUB_RATE = 74.6947
- функцию convertUsdToRub(value: number): number
- функцию formatRubFromUsd(valueUsd: number): string
- при необходимости функцию formatRub(valueRub: number): string

Рекомендуемая логика:

const USD_TO_RUB_RATE = 74.6947;

export function convertUsdToRub(valueUsd: number | null | undefined): number {
  const safeValue = Number(valueUsd ?? 0);
  if (!Number.isFinite(safeValue)) return 0;
  return safeValue * USD_TO_RUB_RATE;
}

export function formatRubFromUsd(valueUsd: number | null | undefined): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(convertUsdToRub(valueUsd));
}

Если нужен формат с одним знаком после запятой для небольших значений, можно использовать maximumFractionDigits: 1, но для KPI лучше 0 знаков.

3. Заменить UI-отображение USD на RUB

Примеры:
- 70 306 USD должно стать примерно 5 250 183 ₽
- 10 803,5 USD должно стать примерно 806 971 ₽
- 11 760 USD должно стать примерно 878 410 ₽

Не обязательно добиваться именно этих строк вручную, formatter сам должен посчитать по курсу 74.6947.

Важно:
- Не делать конвертацию дважды.
- Если переменная называется inventoryValue и по текущему UI отображается как USD, считай её USD и форматируй через formatRubFromUsd.
- Если где-то уже появится RUB/₽ после твоих изменений, не прогоняй это же значение повторно через convertUsdToRub.

4. Русифицировать оставшиеся денежные подписи

Если рядом с деньгами остались английские подписи, переведи их:
- Inventory value → Стоимость запасов
- Potential write-off → Потенциальное списание
- Unit cost → Стоимость единицы
- Order cost → Стоимость заказа
- Holding cost → Стоимость хранения
- Value → Стоимость

Но не переводить имена переменных, типы, ключи API и технические поля.

5. Проверить, что не сломаны API и данные

Запрещено менять:
- app/api/*
- lib/ai/*
- lib/supabase/*
- supabase/*
- .env*
- seed.sql
- migrations
- auth backend logic
- OpenRouter logic

Исключение:
- если уже существующий общий formatter лежит в lib/utils/*, его можно менять.
- если UI импортирует formatter из lib/utils/*, это допустимо.

6. Проверить все UI-страницы

Проверь отображение денежных значений на:
- / — dashboard
- /sku — каталог SKU
- /sku/[id] — карточка SKU
- /methodology, если там есть денежные примеры
- /login, если там есть упоминания стоимости

Ожидаемый результат:
- В UI больше нет "USD" и "$".
- Денежные значения показываются в рублях через символ ₽.
- Значения сконвертированы по курсу 74.6947.
- Недежные единицы измерения не затронуты.
- AI, SKU, ABC, ROP, EOQ остаются как есть.

7. Проверка поиска после изменений

Выполни или предложи выполнить:
- поиск по "USD"
- поиск по "$"
- поиск по "Inventory value"
- поиск по "Potential write-off"

Если такие строки остались только в комментарии к курсу или документации — это допустимо.
Если они остались в пользовательском UI — исправить.

8. Проверка качества

После изменений запусти:

npm run lint
npm run build

Если есть ошибки TypeScript/ESLint — исправь их.

В конце ответа дай:
1. Список изменённых файлов.
2. Где добавлен курс USD/RUB.
3. Какие UI-блоки переведены на рубли.
4. Подтверждение, что Supabase schema, seed, API и AI engine не менялись.
5. Подтверждение, что конвертация выполняется только на уровне отображения.
6. Результаты npm run lint и npm run build.
````

## Prompt 49 — Подготовка промта для горизонта планирования
````text
Сейчас у нас прогноз строится на 3 месяца максимум. Давай доработаем, чтобы мы могли выбирать прогноз на 1,3,6 месяцев, переключением бегунка на 1, 3, или 6 месяцев прогноз
````

## Prompt 50 — Доработка горизонта планирования в Claude Code
````text
Ты работаешь в проекте AIForecast — Next.js App Router / React / TypeScript / Tailwind CSS MVP для AI-прогнозирования запасов лекарственных средств.

Задача: доработать карточку SKU так, чтобы пользователь мог выбирать горизонт AI-прогноза на 1, 3 или 6 месяцев через переключатель/бегунок.

Контекст:
- По требованиям проекта AI-прогноз должен быть на 1/3/6 месяцев.
- В AI schema проекта должны существовать значения прогноза для 1, 3 и 6 месяцев.
- Страница карточки SKU: app/(protected)/sku/[id]/page.tsx
- Компоненты карточки SKU: components/sku/detail/*
- Графики карточки SKU: components/charts/sku/*
- Shared UI components: components/ui/*

Главный принцип:
- Это UI/UX-доработка карточки SKU.
- Не меняй Supabase schema, seed/demo data, AI engine, OpenRouter logic, auth и app/api/* без отдельного явного согласования.
- Не добавляй fake/mock forecast data.
- Используй только реальные данные, которые уже приходят из API/DTO.
- Если API/DTO не содержит forecast на 1/3/6 месяцев, не придумывай данные. В конце напиши, что требуется отдельная задача для Codex по расширению API/DTO.

Что нужно сделать:

1. Найти текущий блок AI-прогноза в карточке SKU

Проверь файлы:
- app/(protected)/sku/[id]/page.tsx
- components/sku/detail/*
- components/charts/sku/*

Найди место, где сейчас отображается прогноз, который, по текущему поведению, максимум на 3 месяца.

2. Проверить структуру данных

Проверь, какие поля latest AI forecast / aiForecast / analysis приходят в компонент.

Нужно найти реальные значения для:
- прогноз на 1 месяц
- прогноз на 3 месяца
- прогноз на 6 месяцев

Возможные имена полей:
- forecast_1m / forecast1m
- forecast_3m / forecast3m
- forecast_6m / forecast6m
- oneMonthDemand
- threeMonthDemand
- sixMonthDemand
- analysis.forecast.oneMonthDemand
- analysis.forecast.threeMonthDemand
- analysis.forecast.sixMonthDemand

Если такие поля уже есть — используй их.
Если нет — не придумывай значения, а напиши в конце, что нужна backend/API-доработка.

3. Добавить переключатель горизонта прогноза

В блок AI-прогноза добавь понятный UI-контрол:

Вариант предпочтительный:
- сегментированный переключатель с тремя значениями:
  - 1 месяц
  - 3 месяца
  - 6 месяцев

Допустимый вариант:
- slider/range с тремя фиксированными позициями:
  - 1
  - 3
  - 6

Так как пользователь просит "бегунок", можно сделать slider, но если в текущем UI лучше смотрится segmented control, выбери его. Главное — чтобы выбор был очевиден и красиво выглядел.

Требования к UX:
- выбранное значение визуально выделено;
- переключение происходит без перезагрузки страницы;
- состояние хранится локально в client component через useState;
- по умолчанию выбран горизонт 3 месяца;
- рядом с числом прогноза должна меняться подпись:
  - Прогноз на 1 месяц
  - Прогноз на 3 месяца
  - Прогноз на 6 месяцев

4. Обновить отображаемые значения

При выборе горизонта:
- 1 месяц → показывать forecast 1m / oneMonthDemand;
- 3 месяца → показывать forecast 3m / threeMonthDemand;
- 6 месяцев → показывать forecast 6m / sixMonthDemand.

Обновить:
- основное число прогноза;
- подпись периода;
- если есть карточки/мини-KPI вокруг прогноза — они должны соответствовать выбранному горизонту;
- если есть график forecast vs fact, аккуратно проверь, нужно ли подсветить выбранный горизонт. Если это сложно и рискованно, не ломай график, ограничься основным блоком прогноза.

5. Русский интерфейс

Все новые подписи должны быть на русском.

Используй:
- "Горизонт прогноза"
- "1 месяц"
- "3 месяца"
- "6 месяцев"
- "Прогноз на 1 месяц"
- "Прогноз на 3 месяца"
- "Прогноз на 6 месяцев"
- "AI-прогноз"

Разрешённые аббревиатуры остаются:
- AI
- SKU
- ABC
- ROP
- EOQ

6. Empty state

Если AI-прогноз ещё не рассчитан:
- не показывай нули как реальные прогнозы;
- не добавляй fake data;
- покажи честный русский empty state, например:
  "AI-прогноз ещё не рассчитан. Нажмите «Пересчитать AI-прогноз», чтобы получить прогноз на 1, 3 и 6 месяцев."

Если часть горизонтов отсутствует:
- покажи "Нет данных" только для отсутствующего горизонта;
- не рассчитывай 6 месяцев как 3 месяца × 2;
- не рассчитывай 1 месяц из 3 месяцев вручную.

7. Не ломать кнопку пересчёта AI-прогноза

Кнопка "Пересчитать AI-прогноз" должна остаться.
После успешного пересчёта UI должен использовать обновлённые forecast values.
Если текущая реализация уже обновляет состояние после POST /api/ai/forecast/[skuId], сохрани это поведение.

8. Проверить адаптивность

На desktop переключатель должен выглядеть аккуратно в блоке AI-прогноза.
На mobile он не должен ломать ширину карточки:
- допускается перенос;
- кнопки/сегменты должны быть удобны для нажатия.

9. Границы изменений

Можно менять:
- app/(protected)/sku/[id]/page.tsx
- components/sku/detail/*
- components/charts/sku/*, только если это действительно нужно для прогноза
- локальные helper-функции внутри этих компонентов

Не менять без необходимости:
- components/ui/*
- types/api.ts
- types/ai.ts

Не менять:
- app/api/*
- lib/ai/*
- lib/supabase/*
- supabase/*
- .env*
- seed/demo data
- auth backend logic
- OpenRouter logic

Если для корректной реализации потребуется изменение types/api.ts или types/ai.ts:
- сначала проверь, можно ли обойтись существующими типами;
- если нельзя, сделай минимальное изменение типа;
- не меняй форму API-ответа, только уточни тип под фактически существующие поля.

10. Проверка после изменений

После правок проверь:
- карточка SKU открывается;
- при наличии AI-прогноза можно переключать 1/3/6 месяцев;
- по умолчанию выбран 3 месяца;
- значения меняются без reload;
- empty state корректный, если прогноза нет;
- кнопка "Пересчитать AI-прогноз" работает как раньше;
- нет новых английских пользовательских строк;
- TypeScript не сломан.

Запусти:
npm run lint
npm run build

В конце ответа дай:
1. Список изменённых файлов.
2. Какой UI-контрол выбран: slider или segmented control, и почему.
3. Какие поля данных используются для прогноза 1/3/6 месяцев.
4. Подтверждение, что fake/mock forecast не добавлялся.
5. Подтверждение, что API, Supabase и AI engine не менялись.
6. Результаты npm run lint и npm run build.
````