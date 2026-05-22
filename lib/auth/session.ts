import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { users } from "@/lib/demo/data";
import type { DemoUser, RoleCode } from "@/lib/demo/types";

export const SESSION_COOKIE = "axieme_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

type SessionPayload = {
  userId: string;
  tenantId: string;
  role: RoleCode;
  distributorId?: string;
  impersonating?: boolean;
  exp: number;
};

function encode(payload: SessionPayload) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function decode(value: string | undefined): SessionPayload | null {
  if (!value) return null;
  try {
    const payload = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as SessionPayload;
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const store = await cookies();
  return decode(store.get(SESSION_COOKIE)?.value);
}

export async function getCurrentUser(): Promise<DemoUser | null> {
  const session = await getSession();
  if (!session) return null;
  return users.find((user) => user.id === session.userId && user.tenantId === session.tenantId) ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}

export async function createSession(user: DemoUser) {
  const store = await cookies();
  const payload: SessionPayload = {
    userId: user.id,
    tenantId: user.tenantId,
    role: user.role,
    distributorId: user.distributorId,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  store.set(SESSION_COOKIE, encode(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function authenticate(identifier: string, password: string) {
  const normalized = identifier.trim().toLowerCase();
  const user = users.find((item) => item.email.toLowerCase() === normalized || item.username.toLowerCase() === normalized);
  if (!user) return null;
  return bcrypt.compareSync(password, user.passwordHash) ? user : null;
}
