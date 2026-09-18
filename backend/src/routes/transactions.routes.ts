import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";

const router = Router();

const txSchema = z.object({
  userId: z.string().optional(),
  type: z.enum(["savings", "loan", "repayment", "contribution", "sale"]),
  amount: z.coerce.number().positive(),
  description: z.string().min(2).max(300),
  date: z.string().datetime().optional(),
  authorizedBy: z.string().max(120).optional(),
});

router.get(
  "/",
  authenticate,
  asyncHandler(async (req, res) => {
    const requested = typeof req.query.userId === "string" ? req.query.userId : undefined;
    const userId = req.user!.role === "member" ? req.user!.id : requested;

    const transactions = await prisma.transaction.findMany({
      where: userId ? { userId } : {},
      orderBy: { date: "desc" },
      take: 500,
    });
    res.json(
      transactions.map((t) => ({
        id: t.id,
        userId: t.userId,
        type: t.type,
        amount: t.amount,
        description: t.description,
        date: t.date.toISOString(),
        authorizedBy: t.authorizedBy ?? undefined,
      }))
    );
  })
);

router.post(
  "/",
  authenticate,
  validate(txSchema),
  asyncHandler(async (req, res) => {
    const input = req.body as z.infer<typeof txSchema>;
    const userId = req.user!.role === "member" ? req.user!.id : input.userId || req.user!.id;

    const tx = await prisma.transaction.create({
      data: {
        userId,
        type: input.type,
        amount: input.amount,
        description: input.description,
        date: input.date ? new Date(input.date) : new Date(),
        authorizedBy: input.authorizedBy,
      },
    });
    res.status(201).json({
      id: tx.id,
      userId: tx.userId,
      type: tx.type,
      amount: tx.amount,
      description: tx.description,
      date: tx.date.toISOString(),
      authorizedBy: tx.authorizedBy ?? undefined,
    });
  })
);

export default router;
