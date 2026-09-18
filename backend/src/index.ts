import { createApp } from "./app";
import { env } from "./config/env";
import { connectDB, prisma } from "./config/prisma";

async function bootstrap() {
  const dbReady = await connectDB();
  const app = createApp();

  const server = app.listen(env.port, () => {
    console.log(`\n  HerWay AI API running on http://localhost:${env.port}`);
    console.log(`  Environment : ${env.nodeEnv}`);
    console.log(`  AI provider : ${env.aiProvider}`);
    console.log(`  Database    : ${dbReady ? "connected" : "unavailable (demo-only)"}\n`);
  });

  const shutdown = async (signal: string) => {
    console.log(`\n[HerWay] ${signal} received — shutting down gracefully.`);
    server.close(async () => {
      await prisma.$disconnect().catch(() => {});
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("unhandledRejection", (reason) => {
    console.error("[HerWay] Unhandled rejection:", reason);
  });
}

void bootstrap();
