import { fetchSkuDataBundle } from "@/lib/sku/queries";
import type { SkuDataBundle } from "@/lib/sku/types";

export async function fetchDashboardData(): Promise<SkuDataBundle> {
  return fetchSkuDataBundle();
}
