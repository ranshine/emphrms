import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "./session";

/** Returns the signed-in admin's session, or null. Use in route handlers and server components. */
export async function getSession() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}
