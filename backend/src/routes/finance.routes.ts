import { Router } from "express";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { authenticate } from "../middleware/auth";

function resolveUserId(req: any): string | undefined {
  const requested = typeof req.query.userId === "string" ? req.query.userId : undefined;
  return req.user?.role === "member" ? req.user.id : requested;
}

export const savingsRouter = Router();
savingsRouter.get(
  "/",
  authenticate,
  asyncHandler(async (req, res) => {
    const userId = resolveUserId(req);
    const rows = await prisma.savingsRecord.findMany({
      where: userId ? { userId } : {},
      orderBy: { date: "desc" },
      take: 500,
    });
    res.json(
      rows.map((s) => ({
        id: s.id,
        userId: s.userId,
        date: s.date.toISOString(),
        amount: s.amount,
        channel: s.channel ?? undefined,
        note: s.note ?? undefined,
      }))
    );
  })
);

export const loansRouter = Router();
loansRouter.get(
  "/",
  authenticate,
  asyncHandler(async (req, res) => {
    const userId = resolveUserId(req);
    const rows = await prisma.loan.findMany({
      where: userId ? { userId } : {},
      orderBy: { issuedAt: "desc" },
      take: 200,
    });
    res.json(
      rows.map((l) => ({
        id: l.id,
        userId: l.userId,
        principal: l.principal,
        balance: l.balance,
        interestRate: l.interestRate,
        issuedAt: l.issuedAt.toISOString(),
        purpose: l.purpose ?? undefined,
        status: l.status,
      }))
    );
  })
);

export const repaymentsRouter = Router();
repaymentsRouter.get(
  "/",
  authenticate,
  asyncHandler(async (req, res) => {
    const userId = resolveUserId(req);
    const rows = await prisma.repayment.findMany({
      where: userId ? { userId } : {},
      orderBy: { date: "desc" },
      take: 500,
    });
    res.json(
      rows.map((r) => ({
        id: r.id,
        loanId: r.loanId,
        userId: r.userId,
        amount: r.amount,
        date: r.date.toISOString(),
      }))
    );
  })
);
