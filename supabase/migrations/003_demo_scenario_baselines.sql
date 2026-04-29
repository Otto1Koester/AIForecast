create table if not exists public.demo_scenario_baselines (
  id uuid primary key default gen_random_uuid(),
  sku_id uuid not null unique references public.sku_items(id) on delete cascade,
  original_current_stock numeric not null,
  original_movements jsonb not null,
  active_scenario text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint demo_scenario_baselines_original_current_stock_nonnegative check (original_current_stock >= 0),
  constraint demo_scenario_baselines_original_movements_array check (jsonb_typeof(original_movements) = 'array'),
  constraint demo_scenario_baselines_active_scenario_valid check (
    active_scenario is null or active_scenario in ('stockout', 'overstock')
  )
);

create index if not exists demo_scenario_baselines_sku_id_idx
  on public.demo_scenario_baselines (sku_id);

alter table public.demo_scenario_baselines enable row level security;

grant all privileges on table public.demo_scenario_baselines to service_role;
grant all privileges on all sequences in schema public to service_role;
