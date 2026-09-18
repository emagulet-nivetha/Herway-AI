import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { optionalAuth } from "../middleware/auth";
import { aiLimiter } from "../middleware/rateLimiter";
import { generateAI, type AIFeature } from "../services/ai.service";

const router = Router();

const FEATURES: AIFeature[] = [
  "chat",
  "product-description",
  "skill-match",
  "business-advisor",
  "translation",
  "market-insights",
];

const bodySchema = z.object({
  input: z.string().max(4000).default(""),
  context: z.record(z.unknown()).optional(),
  language: z.string().max(10).optional(),
});

router.post(
  "/:feature",
  aiLimiter,
  optionalAuth,
  asyncHandler(async (req, res) => {
    const feature = req.params.feature as AIFeature;
    if (!FEATURES.includes(feature)) {
      throw ApiError.badRequest(`Unknown AI feature "${req.params.feature}"`);
    }

    const parsed = bodySchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      throw ApiError.badRequest("Invalid AI request", parsed.error.issues);
    }

    const response = await generateAI({
      feature,
      input: parsed.data.input,
      context: parsed.data.context,
      language: parsed.data.language,
      userId: req.user?.id,
    });

    res.json(response);
  })
);

export default router;
