import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { authenticate } from "../middleware/auth";
import { requireRoles } from "../middleware/rbac";
import { validate } from "../middleware/validate";
import { serializeOrder } from "../utils/serialize";
import type { OrderStatus } from "@prisma/client";

const router = Router();

const placeSchema = z.object({
  userId: z.string().optional(),
  items: z
    .array(z.object({ productId: z.string(), quantity: z.coerce.number().min(1).max(999) }))
    .min(1, "Your cart is empty"),
  delivery: z.string().max(300).optional(),
});

const statusSchema = z.object({
  status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]),
});

router.get(
  "/",
  authenticate,
  asyncHandler(async (req, res) => {
    const requested = typeof req.query.userId === "string" ? req.query.userId : undefined;
    const isAdmin = req.user!.role !== "member";
    const userId = isAdmin ? requested : req.user!.id;

    const orders = await prisma.order.findMany({
      where: userId ? { userId } : {},
      include: { items: true },
      orderBy: { placedAt: "desc" },
      take: 200,
    });
    res.json(orders.map(serializeOrder));
  })
);

router.post(
  "/",
  authenticate,
  validate(placeSchema),
  asyncHandler(async (req, res) => {
    const input = req.body as z.infer<typeof placeSchema>;
    const userId = req.user!.role === "member" ? req.user!.id : input.userId || req.user!.id;

    const products = await prisma.product.findMany({
      where: { id: { in: input.items.map((i) => i.productId) } },
    });
    if (products.length === 0) throw ApiError.badRequest("No valid products in your cart");

    const items = input.items
      .map((line) => {
        const p = products.find((x) => x.id === line.productId);
        if (!p) return null;
        return {
          productId: p.id,
          productName: p.name,
          price: p.price,
          quantity: line.quantity,
          imageUrl: p.imageUrl,
        };
      })
      .filter(Boolean) as {
      productId: string;
      productName: string;
      price: number;
      quantity: number;
      imageUrl: string;
    }[];

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

    const order = await prisma.order.create({
      data: {
        userId,
        customerName: user?.name || "Customer",
        total,
        status: "pending",
        delivery: input.delivery,
        items: { create: items },
      },
      include: { items: true },
    });

    res.status(201).json(serializeOrder(order));
  })
);

router.patch(
  "/:id/status",
  authenticate,
  requireRoles("cooperative_admin", "platform_admin"),
  validate(statusSchema),
  asyncHandler(async (req, res) => {
    const { status } = req.body as z.infer<typeof statusSchema>;
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: status as OrderStatus },
      include: { items: true },
    });
    res.json(serializeOrder(order));
  })
);

export default router;
