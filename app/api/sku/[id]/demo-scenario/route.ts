import { NextResponse } from "next/server";
import { z } from "zod";

import {
  applySkuDemoScenario,
  DemoScenarioError,
} from "@/lib/sku/demo-scenarios";
import { jsonError, requireApiUser } from "@/lib/utils/api";

export const runtime = "nodejs";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const requestBodySchema = z.object({
  scenario: z.enum(["stockout", "overstock", "reset"]),
});

async function readRequestBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { response } = await requireApiUser();

    if (response) {
      return response;
    }

    const parsedParams = paramsSchema.safeParse(await params);

    if (!parsedParams.success) {
      return jsonError("Некорректный идентификатор SKU.", 400);
    }

    const parsedBody = requestBodySchema.safeParse(await readRequestBody(request));

    if (!parsedBody.success) {
      return jsonError(
        "Некорректный сценарий. Допустимые значения: stockout, overstock, reset.",
        400,
      );
    }

    const result = await applySkuDemoScenario(
      parsedParams.data.id,
      parsedBody.data.scenario,
    );

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof DemoScenarioError) {
      return jsonError(error.message, error.status);
    }

    console.error("PATCH /api/sku/[id]/demo-scenario failed", error);
    return jsonError("Не удалось применить демо-сценарий.", 500);
  }
}
