import type { AiForecastContext } from "@/lib/ai/context";

export type AiForecastMessage = {
  role: "system" | "user";
  content: string;
};

function buildPromptContext(context: AiForecastContext) {
  return {
    asOfDate: context.asOfDate,
    skuPassport: context.skuPassport,
    currentStock: context.currentStock,
    costs: context.costs,
    leadTimeDays: context.leadTimeDays,
    serviceLevel: context.serviceLevel,
    lots: context.lots,
    movementHistory: context.movementHistory,
    anomalyMonths: context.anomalyMonths,
    referenceMetrics: context.referenceMetrics,
    previousForecast: context.previousForecast,
  };
}

export function buildAiForecastMessages(
  context: AiForecastContext,
): AiForecastMessage[] {
  return [
    {
      role: "system",
      content:
        "Ты AI-аналитик supply chain для фармацевтической компании. Анализируй запасы лекарственных средств, учитывай сезонность, тренды, аномалии, lead time, сроки годности и списания. Верни только JSON строго по schema, без markdown и пояснений вне JSON. Не выдумывай SKU, которых нет во входе. ROP, EOQ и прогнозы должны быть неотрицательными. Если данных мало, снизь confidence и объясни uncertainty в русскоязычных explanation/reasoning. Рекомендации должны быть практическими. Все enum значения оставь строго на английском.",
    },
    {
      role: "user",
      content: JSON.stringify({
        language: "ru",
        task: "Сформируй AI forecast analysis для одного SKU.",
        context: buildPromptContext(context),
      }),
    },
  ];
}
