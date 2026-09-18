import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { authenticate } from "../middleware/auth";
import { requireRoles } from "../middleware/rbac";
import { memberFinancialSummary, cooperativeAnalytics } from "../services/analytics.service";

const router = Router();

/** Per-member summary: GET /api/analytics/me?userId= */
router.get(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => {
    const requested = typeof req.query.userId === "string" ? req.query.userId : undefined;
    const userId = req.user!.role === "member" ? req.user!.id : requested || req.user!.id;
    res.json(await memberFinancialSummary(userId));
  })
);

/** Cooperative-wide analytics: GET /api/analytics */
router.get(
  "/",
  authenticate,
  requireRoles("cooperative_admin", "platform_admin"),
  asyncHandler(async (_req, res) => {
    res.json(await cooperativeAnalytics());
  })
);

export default router;
