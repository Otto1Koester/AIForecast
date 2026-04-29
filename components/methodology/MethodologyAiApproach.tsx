import type { ReactNode } from "react";

import { aiInputGroups } from "./methodology-content";
import {
  MethodologyBadge,
  MethodologyCard,
  MethodologySection,
} from "./MethodologySection";

export function MethodologyAiApproach(): ReactNode {
  return (
    <MethodologySection
      eyebrow="Входные данные AI"
      title="Что получает AI перед расчётом"
      description="Модель получает не свободный текст, а структурированный контекст по SKU. Так прогноз можно объяснить бизнесу и проверить кодом."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {aiInputGroups.map((group) => (
          <MethodologyCard
            key={group.title}
            title={group.title}
            description={group.description}
          >
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <MethodologyBadge key={item}>{item}</MethodologyBadge>
              ))}
            </div>
          </MethodologyCard>
        ))}
      </div>
    </MethodologySection>
  );
}
