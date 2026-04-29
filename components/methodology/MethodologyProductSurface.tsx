import type { ReactNode } from "react";

import { uiSurfaces } from "./methodology-content";
import { MethodologyCard, MethodologySection } from "./MethodologySection";

export function MethodologyProductSurface(): ReactNode {
  return (
    <MethodologySection
      eyebrow="Интерфейс"
      title="Что показывает интерфейс"
      description="Методология связана с рабочими экранами продукта: dashboard даёт обзор, каталог помогает сравнивать SKU, карточка объясняет решение по конкретной позиции."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {uiSurfaces.map((surface) => (
          <MethodologyCard
            key={surface.title}
            title={surface.title}
            description={surface.description}
          />
        ))}
      </div>
    </MethodologySection>
  );
}
