import { NextResponse } from "next/server";

import { createDashboardResponse } from "@/lib/dashboard/mappers";
import { fetchDashboardData } from "@/lib/dashboard/queries";
import { jsonError, requireApiUser } from "@/lib/utils/api";

export async function GET() {
  try {
    const { response } = await requireApiUser();

    if (response) {
      return response;
    }

    const data = await fetchDashboardData();

    return NextResponse.json(createDashboardResponse(data));
  } catch (error) {
    console.error("GET /api/dashboard failed", error);
    return jsonError("Failed to load dashboard data.", 500);
  }
}
