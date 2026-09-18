import { PrismaClient } from "@prisma/client";
import { env } from "./env";

export const prisma = new PrismaClient({
  log: env.isProd ? ["error"] : ["warn", "error"],
});

export async function connectDB(): Promise<boolean> {
  try {
    await prisma.$connect();
    return true;
  } catch (err) {
    console.warn(
      "[HerWay] Database unreachable — API endpoints that need the database will return 503.",
      (err as Error).message
    );
    return false;
  }
}
