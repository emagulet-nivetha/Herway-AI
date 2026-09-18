import { Router } from "express";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get(
  "/",
  authenticate,
  asyncHandler(async (req, res) => {
    const requested = typeof req.query.userId === "string" ? req.query.userId : undefined;
    const userId = req.user!.role === "member" ? req.user!.id : requested || req.user!.id;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    res.json(
      notifications.map((n) => ({
        id: n.id,
        userId: n.userId,
        title: n.title,
        body: n.body,
        read: n.read,
        type: n.type,
        createdAt: n.createdAt.toISOString(),
      }))
    );
  })
);

router.patch(
  "/:id/read",
  authenticate,
  asyncHandler(async (req, res) => {
    await prisma.notification.update({
      where: { id: req.params.id },
      data: { read: true },
    });
    res.status(204).send();
  })
);

export default router;
