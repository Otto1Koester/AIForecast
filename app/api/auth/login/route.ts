import { compare } from "bcryptjs";
import { NextResponse } from "next/server";

import { createSessionToken, getSessionCookieOptions } from "@/lib/auth/session";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

type LoginRequestBody = {
  username?: unknown;
  password?: unknown;
};

type AppUserAuthRow = {
  id: string;
  username: string;
  password_hash: string;
  display_name: string | null;
};

function invalidCredentialsResponse() {
  return NextResponse.json(
    { error: "Неверный логин или пароль" },
    { status: 401 },
  );
}

async function readLoginBody(request: Request): Promise<LoginRequestBody | null> {
  try {
    return (await request.json()) as LoginRequestBody;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const body = await readLoginBody(request);
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!username || !password) {
    return NextResponse.json(
      { error: "Введите логин и пароль" },
      { status: 400 },
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("app_users")
    .select("id, username, password_hash, display_name")
    .eq("username", username)
    .maybeSingle();

  if (error || !data) {
    return invalidCredentialsResponse();
  }

  const user = data as AppUserAuthRow;
  const passwordMatches = await compare(password, user.password_hash);

  if (!passwordMatches) {
    return invalidCredentialsResponse();
  }

  const displayName = user.display_name?.trim() || user.username;
  const token = await createSessionToken({
    id: user.id,
    username: user.username,
    displayName,
  });

  const response = NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      displayName,
    },
  });

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    ...getSessionCookieOptions(),
  });

  return response;
}
