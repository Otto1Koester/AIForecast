begin;

delete from public.ai_forecast_runs;
delete from public.ai_forecasts;
delete from public.inventory_movements;
delete from public.inventory_lots;
delete from public.sku_items;
delete from public.app_users;

insert into public.app_users (
  id,
  username,
  password_hash,
  display_name
) values (
  '00000000-0000-0000-0000-000000000001',
  'demo',
  '$2b$10$C1esezaF46bdvYGesZJsWejuEbUXo5YW4vfIx8rEOfUA6hMd1is5i',
  'Demo User'
);

insert into public.sku_items (
  id,
  name,
  dosage_form,
  category,
  storage_condition,
  shelf_life_days,
  current_stock,
  unit,
  unit_cost,
  order_cost,
  holding_cost_rate,
  lead_time_days,
  service_level,
  supplier
) values
  ('10000000-0000-0000-0000-000000000001', 'Парацетамол 500 мг', 'таблетки, блистер N10', 'Анальгетики и жаропонижающие', 'room_temperature', 1095, 280, 'pack', 1.15, 85, 0.18, 7, 0.98, 'Pharmstandard Logistics'),
  ('10000000-0000-0000-0000-000000000002', 'Омепразол 20 мг', 'капсулы, флакон N30', 'Гастроэнтерология', 'room_temperature', 730, 1450, 'pack', 2.4, 110, 0.2, 12, 0.94, 'MedLine Trade'),
  ('10000000-0000-0000-0000-000000000003', 'Осельтамивир 75 мг', 'капсулы, блистер N10', 'Противовирусные', 'room_temperature', 730, 180, 'pack', 12.8, 160, 0.24, 21, 0.97, 'NorthBio Supply'),
  ('10000000-0000-0000-0000-000000000004', 'Лоратадин 10 мг', 'таблетки, блистер N10', 'Антигистаминные', 'room_temperature', 1095, 260, 'pack', 1.9, 75, 0.16, 9, 0.95, 'AllergoPharm'),
  ('10000000-0000-0000-0000-000000000005', 'Цефтриаксон 1 г', 'порошок для инъекций, флакон', 'Антибактериальные', 'room_temperature', 730, 520, 'vial', 3.8, 130, 0.22, 14, 0.97, 'SterileMed Distribution'),
  ('10000000-0000-0000-0000-000000000006', 'Адалимумаб 40 мг', 'преднаполненный шприц', 'Биологические препараты', 'refrigerated', 540, 28, 'syringe', 420, 380, 0.3, 28, 0.99, 'BioCold Chain'),
  ('10000000-0000-0000-0000-000000000007', 'Натрия хлорид 0,9% 500 мл', 'раствор для инфузий, флакон', 'Инфузионные растворы', 'room_temperature', 730, 3200, 'bottle', 0.65, 95, 0.28, 6, 0.92, 'Hospital Bulk Supply'),
  ('10000000-0000-0000-0000-000000000008', 'Инсулин гларгин 100 ЕД/мл', 'шприц-ручка 3 мл', 'Эндокринология', 'refrigerated', 365, 150, 'pen', 32, 210, 0.26, 18, 0.98, 'Diabetes Care Logistics'),
  ('10000000-0000-0000-0000-000000000009', 'Иммуноглобулин человека 50 мл', 'раствор для инфузий, флакон', 'Иммунология', 'refrigerated', 540, 95, 'vial', 185, 520, 0.27, 75, 0.99, 'Global Plasma GmbH'),
  ('10000000-0000-0000-0000-000000000010', 'Амоксициллин/клавуланат 875/125 мг', 'таблетки, блистер N14', 'Антибактериальные', 'room_temperature', 730, 620, 'pack', 8.6, 155, 0.21, 17, 0.96, 'EuroGenerics'),
  ('10000000-0000-0000-0000-000000000011', 'Ибупрофен детский 100 мг/5 мл', 'суспензия, флакон 100 мл', 'Педиатрия', 'room_temperature', 730, 720, 'bottle', 4.1, 95, 0.2, 10, 0.95, 'PediaPharm'),
  ('10000000-0000-0000-0000-000000000012', 'Метформин 1000 мг', 'таблетки, блистер N60', 'Эндокринология', 'room_temperature', 1095, 410, 'pack', 3.2, 120, 0.17, 13, 0.96, 'CardioMet Supply'),
  ('10000000-0000-0000-0000-000000000013', 'Бисопролол 5 мг', 'таблетки, блистер N30', 'Кардиология', 'room_temperature', 1095, 500, 'pack', 2.8, 100, 0.16, 11, 0.95, 'CardioLine'),
  ('10000000-0000-0000-0000-000000000014', 'Сальбутамол 100 мкг/доза', 'ингалятор аэрозольный 200 доз', 'Пульмонология', 'room_temperature', 730, 260, 'inhaler', 9.5, 145, 0.22, 20, 0.97, 'RespiraTrade'),
  ('10000000-0000-0000-0000-000000000015', 'Ривароксабан 20 мг', 'таблетки, блистер N28', 'Антикоагулянты', 'room_temperature', 730, 130, 'pack', 38, 180, 0.24, 24, 0.98, 'HematoPharm'),
  ('10000000-0000-0000-0000-000000000016', 'Флуконазол 150 мг', 'капсулы N1', 'Противогрибковые', 'room_temperature', 1095, 210, 'pack', 1.7, 70, 0.15, 8, 0.93, 'GenericMed'),
  ('10000000-0000-0000-0000-000000000017', 'Хлоргексидин 0,05% 100 мл', 'раствор наружный, флакон', 'Антисептики', 'room_temperature', 730, 980, 'bottle', 0.55, 65, 0.21, 5, 0.9, 'CleanCare Supply'),
  ('10000000-0000-0000-0000-000000000018', 'Дексаметазон 4 мг/мл', 'раствор для инъекций, ампула', 'Глюкокортикостероиды', 'room_temperature', 730, 480, 'ampoule', 1.1, 80, 0.19, 9, 0.94, 'InjectaPharm'),
  ('10000000-0000-0000-0000-000000000019', 'Вакцина АДС-М', 'суспензия для инъекций, ампула', 'Вакцины', 'refrigerated', 540, 110, 'ampoule', 18, 260, 0.25, 35, 0.99, 'ImmunoCold'),
  ('10000000-0000-0000-0000-000000000020', 'Панкреатин 25000 ЕД', 'капсулы, блистер N20', 'Гастроэнтерология', 'room_temperature', 730, 650, 'pack', 5.7, 105, 0.18, 12, 0.94, 'Digestive Health');

insert into public.inventory_lots (
  sku_id,
  lot_number,
  quantity,
  received_at,
  expires_at
) values
  ('10000000-0000-0000-0000-000000000001', 'PAR-24-101', 90, '2025-10-15', '2026-11-30'),
  ('10000000-0000-0000-0000-000000000001', 'PAR-25-014', 110, '2026-01-18', '2027-02-28'),
  ('10000000-0000-0000-0000-000000000001', 'PAR-25-042', 80, '2026-03-05', '2027-09-30'),
  ('10000000-0000-0000-0000-000000000002', 'OME-24-331', 650, '2025-07-20', '2027-01-31'),
  ('10000000-0000-0000-0000-000000000002', 'OME-25-119', 800, '2026-02-11', '2027-12-31'),
  ('10000000-0000-0000-0000-000000000003', 'OSE-24-088', 55, '2025-09-30', '2026-08-31'),
  ('10000000-0000-0000-0000-000000000003', 'OSE-25-021', 75, '2025-11-15', '2027-05-31'),
  ('10000000-0000-0000-0000-000000000003', 'OSE-25-044', 50, '2026-02-24', '2027-11-30'),
  ('10000000-0000-0000-0000-000000000004', 'LOR-25-061', 120, '2026-02-15', '2027-10-31'),
  ('10000000-0000-0000-0000-000000000004', 'LOR-25-077', 140, '2026-03-10', '2028-01-31'),
  ('10000000-0000-0000-0000-000000000005', 'CEF-24-410', 160, '2025-08-05', '2026-07-31'),
  ('10000000-0000-0000-0000-000000000005', 'CEF-25-012', 180, '2025-12-19', '2027-01-31'),
  ('10000000-0000-0000-0000-000000000005', 'CEF-25-090', 180, '2026-03-01', '2027-08-31'),
  ('10000000-0000-0000-0000-000000000006', 'ADA-25-003', 10, '2026-01-12', '2026-09-30'),
  ('10000000-0000-0000-0000-000000000006', 'ADA-25-008', 18, '2026-03-18', '2027-02-28'),
  ('10000000-0000-0000-0000-000000000007', 'SAL-24-880', 1450, '2025-09-08', '2026-12-31'),
  ('10000000-0000-0000-0000-000000000007', 'SAL-25-244', 1750, '2026-02-06', '2027-09-30'),
  ('10000000-0000-0000-0000-000000000008', 'INS-24-219', 45, '2025-11-10', '2026-05-31'),
  ('10000000-0000-0000-0000-000000000008', 'INS-25-017', 55, '2026-01-22', '2026-09-30'),
  ('10000000-0000-0000-0000-000000000008', 'INS-25-048', 50, '2026-03-12', '2027-03-31'),
  ('10000000-0000-0000-0000-000000000009', 'IVG-24-016', 25, '2025-10-28', '2026-10-31'),
  ('10000000-0000-0000-0000-000000000009', 'IVG-25-004', 35, '2026-02-17', '2027-06-30'),
  ('10000000-0000-0000-0000-000000000009', 'IVG-25-011', 35, '2026-03-25', '2027-12-31'),
  ('10000000-0000-0000-0000-000000000010', 'AMX-24-612', 280, '2025-08-19', '2026-11-30'),
  ('10000000-0000-0000-0000-000000000010', 'AMX-25-027', 340, '2026-02-20', '2027-07-31'),
  ('10000000-0000-0000-0000-000000000011', 'IBU-24-144', 310, '2025-09-25', '2026-10-31'),
  ('10000000-0000-0000-0000-000000000011', 'IBU-25-063', 410, '2026-02-02', '2027-05-31'),
  ('10000000-0000-0000-0000-000000000012', 'MET-24-721', 180, '2025-08-13', '2027-04-30'),
  ('10000000-0000-0000-0000-000000000012', 'MET-25-115', 230, '2026-01-29', '2028-01-31'),
  ('10000000-0000-0000-0000-000000000013', 'BIS-24-322', 220, '2025-07-30', '2027-03-31'),
  ('10000000-0000-0000-0000-000000000013', 'BIS-25-091', 280, '2026-02-14', '2028-02-29'),
  ('10000000-0000-0000-0000-000000000014', 'SLB-24-208', 110, '2025-08-21', '2026-06-30'),
  ('10000000-0000-0000-0000-000000000014', 'SLB-25-052', 150, '2026-02-26', '2027-04-30'),
  ('10000000-0000-0000-0000-000000000015', 'RIV-24-044', 50, '2025-10-06', '2027-01-31'),
  ('10000000-0000-0000-0000-000000000015', 'RIV-25-018', 80, '2026-03-03', '2027-09-30'),
  ('10000000-0000-0000-0000-000000000016', 'FLU-24-098', 90, '2025-06-18', '2027-12-31'),
  ('10000000-0000-0000-0000-000000000016', 'FLU-25-066', 120, '2026-01-10', '2028-08-31'),
  ('10000000-0000-0000-0000-000000000017', 'CHX-24-501', 430, '2025-09-12', '2026-09-30'),
  ('10000000-0000-0000-0000-000000000017', 'CHX-25-033', 550, '2026-02-03', '2027-05-31'),
  ('10000000-0000-0000-0000-000000000018', 'DEX-24-311', 210, '2025-08-24', '2026-12-31'),
  ('10000000-0000-0000-0000-000000000018', 'DEX-25-070', 270, '2026-03-08', '2027-08-31'),
  ('10000000-0000-0000-0000-000000000019', 'VAC-24-026', 45, '2025-11-21', '2026-08-31'),
  ('10000000-0000-0000-0000-000000000019', 'VAC-25-005', 65, '2026-02-23', '2027-04-30'),
  ('10000000-0000-0000-0000-000000000020', 'PAN-24-224', 290, '2025-08-07', '2027-01-31'),
  ('10000000-0000-0000-0000-000000000020', 'PAN-25-043', 360, '2026-02-28', '2027-10-31');

with months as (
  select
    period_month,
    row_number() over (order by period_month) - 1 as month_index
  from (
    select generate_series(date '2024-10-01', date '2026-03-01', interval '1 month')::date as period_month
  ) generated_months
),
sku_ref as (
  select *
  from (values
    ('10000000-0000-0000-0000-000000000001'::uuid, 'PARA_FAST'),
    ('10000000-0000-0000-0000-000000000002'::uuid, 'OMEP_SLOW'),
    ('10000000-0000-0000-0000-000000000003'::uuid, 'OSELT_WINTER'),
    ('10000000-0000-0000-0000-000000000004'::uuid, 'LORA_SUMMER'),
    ('10000000-0000-0000-0000-000000000005'::uuid, 'CEF_WRITE'),
    ('10000000-0000-0000-0000-000000000006'::uuid, 'ADAL_A'),
    ('10000000-0000-0000-0000-000000000007'::uuid, 'SALINE_C'),
    ('10000000-0000-0000-0000-000000000008'::uuid, 'INS_EXPIRY'),
    ('10000000-0000-0000-0000-000000000009'::uuid, 'IVIG_LONG'),
    ('10000000-0000-0000-0000-000000000010'::uuid, 'AMOX_DIVERGE'),
    ('10000000-0000-0000-0000-000000000011'::uuid, 'IBUP_PEDS'),
    ('10000000-0000-0000-0000-000000000012'::uuid, 'MET_CHRONIC'),
    ('10000000-0000-0000-0000-000000000013'::uuid, 'BIS_CHRONIC'),
    ('10000000-0000-0000-0000-000000000014'::uuid, 'SALBUTAMOL'),
    ('10000000-0000-0000-0000-000000000015'::uuid, 'RIVAROX_A'),
    ('10000000-0000-0000-0000-000000000016'::uuid, 'FLUCO_SHORT'),
    ('10000000-0000-0000-0000-000000000017'::uuid, 'CHLOR_BULK'),
    ('10000000-0000-0000-0000-000000000018'::uuid, 'DEXA_INJ'),
    ('10000000-0000-0000-0000-000000000019'::uuid, 'TET_VACC'),
    ('10000000-0000-0000-0000-000000000020'::uuid, 'PANCREATIN')
  ) as seed(sku_id, sku_code)
),
movement_plan as (
  select
    r.sku_id,
    r.sku_code,
    m.period_month,
    case r.sku_code
      when 'PARA_FAST' then case when m.month_index in (0, 3, 6, 9, 12, 15) then 900 else 0 end
      when 'OMEP_SLOW' then case when m.month_index in (0, 6, 12) then 600 else 0 end
      when 'OSELT_WINTER' then case when extract(month from m.period_month)::int in (10, 11) then 220 else 0 end
      when 'LORA_SUMMER' then case
        when m.period_month = date '2026-03-01' then 350
        when extract(month from m.period_month)::int in (4, 5) then 300
        when extract(month from m.period_month)::int = 6 then 200
        else 0
      end
      when 'CEF_WRITE' then case when m.month_index in (0, 4, 8, 12, 16) then 400 else 0 end
      when 'ADAL_A' then case when m.month_index in (0, 6, 12) then 36 else 0 end
      when 'SALINE_C' then case when m.month_index in (0, 4, 8, 12, 16) then 1500 else 0 end
      when 'INS_EXPIRY' then case when m.month_index in (0, 3, 6, 9, 12, 15) then 180 else 0 end
      when 'IVIG_LONG' then case when m.month_index in (0, 8, 16) then 80 else 0 end
      when 'AMOX_DIVERGE' then case when m.month_index in (0, 3, 6, 9, 12, 15) then 350 else 0 end
      when 'IBUP_PEDS' then case when m.month_index in (0, 4, 8, 12, 16) then 500 else 0 end
      when 'MET_CHRONIC' then case when m.month_index in (0, 6, 12) then 700 else 0 end
      when 'BIS_CHRONIC' then case when m.month_index in (0, 5, 10, 15) then 400 else 0 end
      when 'SALBUTAMOL' then case when m.month_index in (0, 4, 8, 12, 16) then 240 else 0 end
      when 'RIVAROX_A' then case when m.month_index in (0, 6, 12) then 120 else 0 end
      when 'FLUCO_SHORT' then case when m.month_index in (0, 5, 10, 15) then 200 else 0 end
      when 'CHLOR_BULK' then case when m.month_index in (0, 6, 12) then 1000 else 0 end
      when 'DEXA_INJ' then case when m.month_index in (0, 4, 8, 12, 16) then 300 else 0 end
      when 'TET_VACC' then case when m.month_index in (0, 9) then 150 else 0 end
      when 'PANCREATIN' then case when m.month_index in (0, 5, 10, 15) then 500 else 0 end
    end::numeric as inbound_qty,
    case r.sku_code
      when 'PARA_FAST' then 290 + m.month_index * 8 + case when m.period_month = date '2026-02-01' then 120 else 0 end
      when 'OMEP_SLOW' then 42 + (m.month_index % 4) * 3
      when 'OSELT_WINTER' then case
        when extract(month from m.period_month)::int = 12 then 130
        when extract(month from m.period_month)::int = 1 then 160
        when extract(month from m.period_month)::int = 2 then 150
        else 22
      end
      when 'LORA_SUMMER' then case
        when extract(month from m.period_month)::int = 4 then 90
        when extract(month from m.period_month)::int = 5 then 150
        when extract(month from m.period_month)::int = 6 then 180
        when extract(month from m.period_month)::int = 7 then 170
        when extract(month from m.period_month)::int = 8 then 140
        when extract(month from m.period_month)::int = 9 then 90
        else 25
      end
      when 'CEF_WRITE' then 112 + (m.month_index % 5) * 6
      when 'ADAL_A' then case when m.month_index % 3 = 0 then 7 else 5 end
      when 'SALINE_C' then 260 + (m.month_index % 4) * 20
      when 'INS_EXPIRY' then 50 + (m.month_index % 4) * 4
      when 'IVIG_LONG' then case when m.month_index % 2 = 0 then 12 else 10 end
      when 'AMOX_DIVERGE' then case
        when m.period_month = date '2026-02-01' then 45
        when m.period_month = date '2026-03-01' then 25
        else 95
      end
      when 'IBUP_PEDS' then case
        when extract(month from m.period_month)::int in (12, 1, 2) then 150
        when extract(month from m.period_month)::int in (10, 11, 3) then 115
        else 82
      end
      when 'MET_CHRONIC' then 115 + m.month_index * 2
      when 'BIS_CHRONIC' then case when m.month_index % 4 = 0 then 78 else 68 end
      when 'SALBUTAMOL' then case
        when extract(month from m.period_month)::int in (11, 12, 1, 2, 3, 4) then 72
        else 45
      end
      when 'RIVAROX_A' then case when m.month_index % 3 = 0 then 24 else 19 end
      when 'FLUCO_SHORT' then case when m.month_index % 5 = 0 then 48 else 34 end
      when 'CHLOR_BULK' then 125 + (m.month_index % 3) * 10
      when 'DEXA_INJ' then case when m.month_index % 4 = 1 then 78 else 62 end
      when 'TET_VACC' then case when extract(month from m.period_month)::int in (4, 5, 9, 10) then 18 else 10 end
      when 'PANCREATIN' then 76 + (m.month_index % 4) * 5
    end::numeric as outbound_qty,
    case
      when r.sku_code = 'CEF_WRITE' and m.period_month = date '2026-01-01' then 180
      when r.sku_code = 'INS_EXPIRY' and m.period_month = date '2026-02-01' then 35
      else 0
    end::numeric as writeoff_qty,
    case
      when r.sku_code = 'PARA_FAST' and m.period_month = date '2026-02-01' then true
      when r.sku_code = 'CEF_WRITE' and m.period_month = date '2026-01-01' then true
      when r.sku_code = 'INS_EXPIRY' and m.period_month = date '2026-02-01' then true
      when r.sku_code = 'AMOX_DIVERGE' and m.period_month = date '2026-03-01' then true
      else false
    end as anomaly_flag,
    case
      when r.sku_code = 'PARA_FAST' and m.period_month = date '2026-02-01' then 'Пиковый расход выше обычного: быстрый SKU приблизился к точке дефицита.'
      when r.sku_code = 'CEF_WRITE' and m.period_month = date '2026-01-01' then 'Аномальное списание после выявления поврежденной транспортной партии.'
      when r.sku_code = 'INS_EXPIRY' and m.period_month = date '2026-02-01' then 'Списание партии с коротким остаточным сроком годности.'
      when r.sku_code = 'AMOX_DIVERGE' and m.period_month = date '2026-03-01' then 'Факт резко ниже исторического контекста, который будет использоваться для будущего прогноза.'
      else null
    end as anomaly_note
  from sku_ref r
  cross join months m
),
movement_totals as (
  select
    mp.*,
    si.current_stock,
    sum(mp.inbound_qty - mp.outbound_qty - mp.writeoff_qty) over (
      partition by mp.sku_id
    ) as total_net_qty,
    sum(mp.inbound_qty - mp.outbound_qty - mp.writeoff_qty) over (
      partition by mp.sku_id
      order by mp.period_month
    ) as running_net_qty
  from movement_plan mp
  join public.sku_items si on si.id = mp.sku_id
)
insert into public.inventory_movements (
  sku_id,
  period_month,
  inbound_qty,
  outbound_qty,
  writeoff_qty,
  ending_stock,
  anomaly_flag,
  anomaly_note
)
select
  sku_id,
  period_month,
  inbound_qty,
  outbound_qty,
  writeoff_qty,
  greatest(0::numeric, current_stock - total_net_qty + running_net_qty) as ending_stock,
  anomaly_flag,
  anomaly_note
from movement_totals
order by sku_id, period_month;

commit;
