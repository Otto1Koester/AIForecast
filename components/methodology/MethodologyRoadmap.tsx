import type { ReactNode } from "react";

import { roadmapItems } from "./methodology-content";
import { MethodologyCard, MethodologySection } from "./MethodologySection";

export function MethodologyRoadmap(): ReactNode {
  return (
    <MethodologySection
      eyebrow="После MVP"
      title="Как развивать систему дальше"
      description="После тестового задания AIForecast можно расширить от демо-сервиса до полноценного контура управления запасами и закупками."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {roadmapItems.map((item) => (
          <MethodologyCard
            key={item.title}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </MethodologySection>
  );
}
