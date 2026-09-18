import "dotenv/config";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  isProd: (process.env.NODE_ENV || "development") === "production",
  port: Number(process.env.PORT) || 5000,
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  jwtSecret: required("JWT_SECRET", "dev-only-insecure-secret-change-me"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 12,

  rateLimitWindowMin: Number(process.env.RATE_LIMIT_WINDOW_MIN) || 15,
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 300,

  aiProvider: (process.env.AI_PROVIDER || "mock") as "mock" | "openai" | "anthropic",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || "",
  aiModel: process.env.AI_MODEL || "gpt-4o-mini",
  aiTimeoutMs: Number(process.env.AI_TIMEOUT_MS) || 30000,

  maxUploadMb: Number(process.env.MAX_UPLOAD_MB) || 5,

  seedAdminEmail: process.env.SEED_ADMIN_EMAIL || "admin@herway.local",
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD || "HerWay@2026",
};
