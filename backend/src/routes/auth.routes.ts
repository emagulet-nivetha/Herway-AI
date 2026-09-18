import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { env } from "../config/env";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { signToken } from "../utils/jwt";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { authLimiter } from "../middleware/rateLimiter";
import { serializeUser } from "../utils/serialize";
import type { Role } from "@prisma/client";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2, "Please enter your full name").max(120),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Use at least 8 characters"),
  role: z.enum(["member", "cooperative_admin", "platform_admin"]).default("member"),
  location: z.string().max(160).optional(),
  phone: z.string().max(30).optional(),
  languages: z.array(z.string()).optional(),
  cooperativeId: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

const userInclude = {
  cooperative: true,
  skills: { include: { skill: true } },
} as const;

router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const input = req.body as z.infer<typeof registerSchema>;
    const email = input.email.toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw ApiError.conflict("An account with this email already exists.");

    const passwordHash = await bcrypt.hash(input.password, env.bcryptRounds);
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email,
        passwordHash,
        role: input.role as Role,
        location: input.location || "India",
        phone: input.phone,
        languages: input.languages?.length ? input.languages : ["en"],
        cooperativeId: input.cooperativeId || null,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
          input.name
        )}&backgroundColor=7047A8`,
      },
      include: userInclude,
    });

    const token = signToken({ sub: user.id, role: user.role, email: user.email });
    res.status(201).json({ token, user: serializeUser(user) });
  })
);

router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const input = req.body as z.infer<typeof loginSchema>;
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
      include: userInclude,
    });
    if (!user) throw ApiError.unauthorized("Invalid email or password.");

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) throw ApiError.unauthorized("Invalid email or password.");

    const token = signToken({ sub: user.id, role: user.role, email: user.email });
    res.json({ token, user: serializeUser(user) });
  })
);

router.get(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: userInclude,
    });
    if (!user) throw ApiError.notFound("User not found");
    res.json(serializeUser(user));
  })
);

export default router;
