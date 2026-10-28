import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

export const unauthorized = () => NextResponse.json({ message: "Unauthorized" }, { status: 401 });

export const badRequest = (message: string) => NextResponse.json({ message }, { status: 400 });

export const isUniqueViolation = (err: unknown) =>
  err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";

export const isForeignKeyViolation = (err: unknown) =>
  err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2003";

/** YYYY-MM-DD for a Date column value. */
export const toDateString = (d: Date) => d.toISOString().slice(0, 10);
