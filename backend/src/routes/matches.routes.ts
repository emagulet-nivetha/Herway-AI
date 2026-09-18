import { Router } from "express";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { optionalAuth } from "../middleware/auth";

const router = Router();

router.get(
  "/",
  optionalAuth,
  asyncHandler(async (_req, res) => {
    const matches = await prisma.matchSuggestion.findMany({
      orderBy: { matchScore: "desc" },
      take: 50,
    });
    res.json(
      matches.map((m) => ({
        id: m.id,
        userName: m.userName,
        avatarUrl: m.avatarUrl,
        location: m.location,
        skills: m.skills,
        interest: m.interest,
        matchScore: m.matchScore,
        opportunity: m.opportunity,
      }))
    );
  })
);

export default router;
