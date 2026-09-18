import rateLimit from "express-rate-limit";
import { env } from "../config/env";

const isTest = env.nodeEnv === "test";

export const generalLimiter = rateLimit({
  windowMs: env.rateLimitWindowMin * 60 * 1000,
  max: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
  message: { message: "Too many requests. Please slow down and try again shortly." },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 1000 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
  message: { message: "Too many login attempts. Please try again in a few minutes." },
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: isTest ? 1000 : 30,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
  message: { message: "AI request limit reached. Please wait a moment and try again." },
});
