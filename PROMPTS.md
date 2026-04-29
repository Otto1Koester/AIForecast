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