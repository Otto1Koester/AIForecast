import { NextResponse } from "next/server";

import { createSkuListResponse } from "@/lib/sku/catalog";
import { fetchSkuDataBundle } from "@/lib/sku/queries";
import { jsonError, requireApiUser } from "@/lib/utils/api";

export async function GET(request: Request) {
  try {
    const { response } = await requireApiUser();

    if (response) {
      return response;
    }

    const bundle = await fetchSkuDataBundle();
    const { searchParams } = new URL(request.url);

    return NextResponse.json(createSkuListResponse(bundle, searchParams));
  } catch (error) {
    console.error("GET /api/sku failed", error);
    return jsonError("Failed to load SKU catalog.", 500);
  }
}
