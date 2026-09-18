import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { authenticate, optionalAuth } from "../middleware/auth";
import { requireSelfOrAdmin } from "../middleware/rbac";
import { validate } from "../middleware/validate";
import { serializeUser } from "../utils/serialize";

const router = Router();

const userInclude = {
  cooperative: true,
  skills: { include: { skill: true } },
} as const;

const addSkillSchema = z.object({
  skillId: z.string().optional(),
  skillName: z.string().min(2, "Skill name is required"),
  category: z.string().default("General"),
  level: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]).default("Beginner"),
  years: z.coerce.number().min(0).max(60).default(0),
});

const updateSchema = z
  .object({
    name: z.string().min(2).max(120).optional(),
    phone: z.string().max(30).optional(),
    location: z.string().max(160).optional(),
    state: z.string().max(80).optional(),
    bio: z.string().max(600).optional(),
    avatarUrl: z.string().max(2_000_000).optional(),
    languages: z.array(z.string()).optional(),
    experienceYears: z.coerce.number().min(0).max(60).optional(),
    achievements: z.array(z.string()).optional(),
    collaborationInterests: z.array(z.string()).optional(),
    verified: z.boolean().optional(),
  })
  .strict();

router.get(
  "/skills",
  authenticate,
  asyncHandler(async (req, res) => {
    const skills = await prisma.userSkill.findMany({
      where: { userId: req.user!.id },
      include: { skill: true },
    });
    res.json(
      skills.map((s) => ({
        id: s.id,
        skillId: s.skillId,
        skillName: s.skill.name,
        category: s.skill.category,
        level: s.level,
        years: s.years,
      }))
    );
  })
);

router.post(
  "/skills",
  authenticate,
  validate(addSkillSchema),
  asyncHandler(async (req, res) => {
    const input = req.body as z.infer<typeof addSkillSchema>;
    let skillId = input.skillId;
    if (!skillId) {
      const existing = await prisma.skill.findFirst({ where: { name: input.skillName } });
      const skill =
        existing ||
        (await prisma.skill.create({
          data: { name: input.skillName, category: input.category },
        }));
      skillId = skill.id;
    }

    const userSkill = await prisma.userSkill.upsert({
      where: { userId_skillId: { userId: req.user!.id, skillId } },
      update: { level: input.level, years: input.years },
      create: { userId: req.user!.id, skillId, level: input.level, years: input.years },
      include: { skill: true },
    });

    res.status(201).json({
      id: userSkill.id,
      skillId: userSkill.skillId,
      skillName: userSkill.skill.name,
      category: userSkill.skill.category,
      level: userSkill.level,
      years: userSkill.years,
    });
  })
);

router.get(
  "/",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const role = typeof req.query.role === "string" ? req.query.role : undefined;
    const cooperativeId =
      typeof req.query.cooperativeId === "string" ? req.query.cooperativeId : undefined;

    const users = await prisma.user.findMany({
      where: {
        ...(role ? { role: role as never } : {}),
        ...(cooperativeId ? { cooperativeId } : {}),
      },
      include: userInclude,
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    res.json(users.map(serializeUser));
  })
);

router.get(
  "/:id",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: userInclude,
    });
    if (!user) throw ApiError.notFound("User not found");
    res.json(serializeUser(user));
  })
);

router.patch(
  "/:id",
  authenticate,
  requireSelfOrAdmin("id"),
  validate(updateSchema),
  asyncHandler(async (req, res) => {
    const patch = req.body as z.infer<typeof updateSchema>;
    if (patch.verified !== undefined && req.user!.role === "member") {
      throw ApiError.forbidden("Only administrators can change verification status.");
    }
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: patch,
      include: userInclude,
    });
    res.json(serializeUser(user));
  })
);

export default router;
