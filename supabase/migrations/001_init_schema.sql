create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  display_name text,
  created_at timestamptz default now()
);

create table if not exists public.sku_items (
  id uuid primary key default gen_random_uuid(),
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
  created_at timestamptz default now(),
  constraint sku_items_shelf_life_days_positive check (shelf_life_days > 0),
  constraint sku_items_current_stock_nonnegative check (current_stock >= 0),
  constraint sku_items_unit_cost_nonnegative check (unit_cost >= 0),
  constraint sku_items_order_cost_nonnegative check (order_cost >= 0),
  constraint sku_items_holding_cost_rate_nonnegative check (holding_cost_rate >= 0),
  constraint sku_items_lead_time_days_positive check (lead_time_days > 0),
  constraint sku_items_service_level_range check (service_level between 0 and 1)
);

create table if not exists public.inventory_lots (
  id uuid primary key default gen_random_uuid(),
  sku_id uuid not null references public.sku_items(id) on delete cascade,
  lot_number text not null,
  quantity numeric not null,
  received_at date not null,
  expires_at date not null,
  created_at timestamptz default now(),
  constraint inventory_lots_quantity_nonnegative check (quantity >= 0),
  constraint inventory_lots_expires_after_received check (expires_at > received_at)
);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  sku_id uuid not null references public.sku_items(id) on delete cascade,
  period_month date not null,
  inbound_qty numeric not null,
  outbound_qty numeric not null,
  writeoff_qty numeric not null,
  ending_stock numeric not null,
  anomaly_flag boolean default false,
  anomaly_note text,
  created_at timestamptz default now(),
  constraint inventory_movements_sku_period_month_key unique (sku_id, period_month),
  constraint inventory_movements_period_month_first_day check (period_month = date_trunc('month', period_month::timestamp)::date),
  constraint inventory_movements_inbound_qty_nonnegative check (inbound_qty >= 0),
  constraint inventory_movements_outbound_qty_nonnegative check (outbound_qty >= 0),
  constraint inventory_movements_writeoff_qty_nonnegative check (writeoff_qty >= 0),
  constraint inventory_movements_ending_stock_nonnegative check (ending_stock >= 0)
);

create table if not exists public.ai_forecasts (
  id uuid primary key default gen_random_uuid(),
  sku_id uuid not null references public.sku_items(id) on delete cascade,
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
  created_at timestamptz default now(),
  constraint ai_forecasts_forecast_1m_nonnegative check (forecast_1m >= 0),
  constraint ai_forecasts_forecast_3m_nonnegative check (forecast_3m >= 0),
  constraint ai_forecasts_forecast_6m_nonnegative check (forecast_6m >= 0),
  constraint ai_forecasts_rop_nonnegative check (rop >= 0),
  constraint ai_forecasts_eoq_nonnegative check (eoq >= 0),
  constraint ai_forecasts_stockout_risk_valid check (stockout_risk in ('low', 'medium', 'high', 'critical')),
  constraint ai_forecasts_overstock_risk_valid check (overstock_risk in ('low', 'medium', 'high', 'critical')),
  constraint ai_forecasts_expiry_risk_valid check (expiry_risk in ('low', 'medium', 'high', 'critical')),
  constraint ai_forecasts_confidence_range check (confidence is null or confidence between 0 and 1)
);

create table if not exists public.ai_forecast_runs (
  id uuid primary key default gen_random_uuid(),
  sku_id uuid references public.sku_items(id) on delete cascade,
  status text not null,
  model text not null,
  input_hash text,
  error_message text,
  created_at timestamptz default now(),
  finished_at timestamptz,
  constraint ai_forecast_runs_status_valid check (status in ('pending', 'success', 'error'))
);

create index if not exists inventory_lots_sku_id_idx
  on public.inventory_lots (sku_id);

create index if not exists inventory_lots_expires_at_idx
  on public.inventory_lots (expires_at);

create index if not exists inventory_movements_sku_id_period_month_idx
  on public.inventory_movements (sku_id, period_month);

create index if not exists ai_forecasts_sku_id_created_at_idx
  on public.ai_forecasts (sku_id, created_at desc);

create index if not exists ai_forecast_runs_sku_id_created_at_idx
  on public.ai_forecast_runs (sku_id, created_at desc);

alter table public.app_users enable row level security;
alter table public.sku_items enable row level security;
alter table public.inventory_lots enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.ai_forecasts enable row level security;
alter table public.ai_forecast_runs enable row level security;
