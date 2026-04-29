import { NextResponse } from "next/server";

import { createSkuDetailResponse } from "@/lib/sku/detail";
import { fetchSkuDetailData } from "@/lib/sku/queries";
import { jsonError, requireApiUser } from "@/lib/utils/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { response } = await requireApiUser();

    if (response) {
      return response;
    }

    const { id } = await params;
    const data = await fetchSkuDetailData(id);

    if (!data.sku) {
      return jsonError("SKU not found", 404);
    }

    return NextResponse.json(createSkuDetailResponse(data, data.sku));
  } catch (error) {
    console.error("GET /api/sku/[id] failed", error);
    return jsonError("Failed to load SKU detail.", 500);
  }
}
