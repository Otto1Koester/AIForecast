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
      eyebrow="Демо"
      title="Ограничения демонстрационной версии"
      description="Эти ограничения важно проговорить на интервью: демо показывает подход, архитектуру и ценность, но не претендует на промышленную систему планирования."
    >
      <MethodologyCard
        title="Честные рамки демо"
        description="Система собрана для демонстрации AI-подхода к управлению запасами ЛС и требует дальнейшей проверки перед промышленным запуском."
        badge="рамки демо"
      >
        <MethodologyCheckList items={mvpLimitations} />
      </MethodologyCard>
    </MethodologySection>
  );
}
