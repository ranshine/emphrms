import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/session";

const bodySchema = z.object({
  userId: z.string().trim().min(1),
  password: z.string().min(1),
  remember: z.boolean().optional(),
});

// Compared against when the user doesn't exist, so response time doesn't reveal valid user IDs.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "User ID and password are required" }, { status: 400 });
  }
  const { userId, password, remember } = parsed.data;

  const login = await prisma.login.findUnique({ where: { userId } });
  const valid = await bcrypt.compare(password, login?.passwordHash ?? DUMMY_HASH);

  if (!login || !valid) {
    return NextResponse.json({ message: "Invalid user ID or password" }, { status: 401 });
  }

  const token = await createSessionToken({ userId: login.userId });
  const res = NextResponse.json({ user: { userId: login.userId } });
  res.cookies.set(SESSION_COOKIE, token, {
    ...sessionCookieOptions,
    // Without maxAge this is a browser-session cookie.
    ...(remember ? { maxAge: SESSION_MAX_AGE } : {}),
  });
  return res;
}
