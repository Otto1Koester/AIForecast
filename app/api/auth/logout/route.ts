import { NextResponse } from "next/server";

import {
  getClearSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/session";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    ...getClearSessionCookieOptions(),
  });

  return response;
}
