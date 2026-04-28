export type AiTrend = "declining" | "stable" | "growing";

export type AiAnomalyType = "spike" | "drop" | "writeoff" | "supply_gap";

export type AiRiskLevel = "low" | "medium" | "high" | "critical";

export type AiRecommendationAction =
  | "reorder"
  | "accelerate_sales"
  | "write_off"
  | "monitor"
  | "adjust_safety_stock";

export type AiRecommendationPriority = "low" | "medium" | "high" | "urgent";

export type AiAnomaly = {
  period: string;
  type: AiAnomalyType;
  explanation: string;
};

export type AiForecastBlock = {
  oneMonthDemand: number;
  threeMonthDemand: number;
  sixMonthDemand: number;
  confidence: number;
  trend: AiTrend;
  seasonality: string;
  anomalies: AiAnomaly[];
};

export type AiReorderBlock = {
  rop: number;
  eoq: number;
  safetyStock: number;
  leadTimeDemand: number;
  explanation: string;
};

export type AiStockoutRisk = {
  level: AiRiskLevel;
  daysToStockout: number | null;
  explanation: string;
};

export type AiOverstockRisk = {
  level: AiRiskLevel;
  daysCoverage: number | null;
  explanation: string;
};

export type AiExpiryRisk = {
  level: AiRiskLevel;
  quantityAtRisk: number;
  explanation: string;
};

export type AiRisksBlock = {
  stockout: AiStockoutRisk;
  overstock: AiOverstockRisk;
  expiry: AiExpiryRisk;
};

export type AiRecommendation = {
  action: AiRecommendationAction;
  priority: AiRecommendationPriority;
  suggestedQuantity?: number;
  deadlineDays?: number;
  reasoning: string;
};

export type AiForecastAnalysis = {
  skuId: string;
  forecast: AiForecastBlock;
  reorder: AiReorderBlock;
  risks: AiRisksBlock;
  recommendations: AiRecommendation[];
  executiveSummary: string;
};

export type AiForecastRecord = {
  id: string;
  skuId: string;
  model: string;
  inputHash: string;
  forecast1m: number;
  forecast3m: number;
  forecast6m: number;
  rop: number;
  eoq: number;
  stockoutRisk: AiRiskLevel;
  overstockRisk: AiRiskLevel;
  expiryRisk: AiRiskLevel;
  confidence: number | null;
  analysis: AiForecastAnalysis;
  createdAt: string;
};

export type AiForecastRunStatus = "pending" | "success" | "error";

export type AiForecastRun = {
  id: string;
  skuId: string;
  status: AiForecastRunStatus;
  model: string;
  inputHash: string | null;
  errorMessage: string | null;
  createdAt: string;
  finishedAt: string | null;
};
