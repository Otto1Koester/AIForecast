import type { ReactNode } from "react";

import {
  reorderCards,
  reorderParameters,
  validationRules,
} from "./methodology-content";
import {
  MethodologyCard,
  MethodologyCheckList,
  MethodologySection,
} from "./MethodologySection";

export function MethodologyReorder(): ReactNode {
  return (
    <MethodologySection
      eyebrow="ROP / EOQ"
      title="Как появляются точка и размер перезаказа"
      description="На демо важно показать не только число, но и логику: почему пора покупать, какой объём рационален и какие параметры повлияли на рекомендацию."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {reorderCards.map((card) => (
          <MethodologyCard
            key={card.title}
            title={card.title}
            description={card.description}
            badge={card.badge}
            className="border-sky-200 bg-sky-50/60 dark:border-sky-900/60 dark:bg-sky-950/20"
          />
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {reorderParameters.map((parameter) => (
            <MethodologyCard
              key={parameter.title}
              title={parameter.title}
              description={parameter.description}
            />
          ))}
        </div>

        <MethodologyCard
          title="Защитные проверки"
          description="AI может ошибиться, поэтому сервер принимает только валидный структурированный JSON и отбрасывает невозможные значения."
          badge="проверка"
        >
          <MethodologyCheckList items={validationRules} />
        </MethodologyCard>
      </div>
    </MethodologySection>
  );
}
