import type { JWTPayload } from "jose";
import { SignJWT, jwtVerify } from "jose";

import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/constants";

export type SessionUser = {
  id: string;
  username: string;
  displayName: string;
};

export type SessionPayload = {
  userId: string;
  username: string;
  displayName: string;
};

type RawSessionPayload = JWTPayload & {
  userId?: unknown;
  username?: unknown;
  displayName?: unknown;
};

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "Missing JWT_SECRET environment variable for AIForecast session signing.",
    );
  }

  return new TextEncoder().encode(secret);
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

export function getClearSessionCookieOptions() {
  return {
    ...getSessionCookieOptions(),
    maxAge: 0,
  };
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getJwtSecret());
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) {
    return null;
  }

  const secret = getJwtSecret();

  try {
    const { payload } = await jwtVerify(token, secret);
    const { userId, username, displayName } = payload as RawSessionPayload;

    if (
      typeof userId !== "string" ||
      typeof username !== "string" ||
      typeof displayName !== "string"
    ) {
      return null;
    }

    return {
      userId,
      username,
      displayName,
    };
  } catch {
    return null;
  }
}

export { SESSION_COOKIE_NAME };
