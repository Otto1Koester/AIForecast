import type { ReactNode } from "react";

import { forecastHorizons, forecastSignals } from "./methodology-content";
import {
  MethodologyCard,
  MethodologyCheckList,
  MethodologySection,
} from "./MethodologySection";

const cacheReasons = [
  "OpenRouter не вызывается на каждый render страницы.",
  "Dashboard, catalog и SKU detail читают один сохранённый forecast.",
  "Кэш снижает стоимость демо и делает UI быстрым и стабильным.",
  "История запусков прогноза помогает объяснить, когда и какой моделью был сделан расчёт.",
];

export function MethodologyForecasting(): ReactNode {
  return (
    <MethodologySection
      eyebrow="Прогноз"
      title="Как строится прогноз спроса"
      description="AI возвращает прогноз потребности на 1, 3 и 6 месяцев, а вместе с числами объясняет сезонность, тренд, аномалии и confidence."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {forecastHorizons.map((horizon) => (
          <MethodologyCard
            key={horizon.title}
            title={horizon.title}
            description={horizon.description}
            badge={horizon.badge}
          />
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {forecastSignals.map((signal) => (
            <MethodologyCard
              key={signal.title}
              title={signal.title}
              description={signal.description}
            />
          ))}
        </div>

        <MethodologyCard
          title="Почему результат сохраняется"
          description="AI-расчёт является бизнес-событием, а не декоративным текстом. Поэтому результат сохраняется в Supabase и переиспользуется до ручного или batch-пересчёта."
          badge="кэш Supabase"
          className="border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/60 dark:bg-emerald-950/20"
        >
          <MethodologyCheckList items={cacheReasons} />
        </MethodologyCard>
      </div>
    </MethodologySection>
  );
}
