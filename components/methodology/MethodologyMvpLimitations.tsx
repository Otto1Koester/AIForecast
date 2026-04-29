import type { ReactNode } from "react";

import { mvpLimitations } from "./methodology-content";
import {
  MethodologyCard,
  MethodologyCheckList,
  MethodologySection,
} from "./MethodologySection";

export function MethodologyMvpLimitations(): ReactNode {
  return (
    <MethodologySection
      eyebrow="MVP"
      title="Ограничения демонстрационной версии"
      description="Эти ограничения важно проговорить на интервью: MVP показывает подход, архитектуру и ценность, но не претендует на промышленную систему планирования."
    >
      <MethodologyCard
        title="Честные рамки MVP"
        description="Система собрана для демонстрации AI-подхода к управлению запасами ЛС и требует дальнейшей валидации перед production."
        badge="рамки демо"
      >
        <MethodologyCheckList items={mvpLimitations} />
      </MethodologyCard>
    </MethodologySection>
  );
}
