import "server-only";
import { cookies } from "next/headers";

const COOKIE = "alba_demo";

/** Mocked session: one demo user, no real auth. Use as a server action. */
export async function startDemoSession(): Promise<void> {
  "use server";
  const jar = await cookies();
  jar.set(COOKIE, "1", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
}

export async function endDemoSession(): Promise<void> {
  "use server";
  (await cookies()).delete(COOKIE);
}

export async function isLoggedIn(): Promise<boolean> {
  return (await cookies()).get(COOKIE)?.value === "1";
}
