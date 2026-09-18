import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { authenticate, optionalAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { serializeProduct } from "../utils/serialize";
import type { Availability, ProductStatus } from "@prisma/client";

const router = Router();

const AVAILABILITY_MAP: Record<string, Availability> = {
  "In Stock": "In_Stock",
  "Made to Order": "Made_to_Order",
  Limited: "Limited",
  In_Stock: "In_Stock",
  Made_to_Order: "Made_to_Order",
};

const productSchema = z.object({
  name: z.string().min(3, "Product name is required").max(160),
  description: z.string().max(4000).default(""),
  price: z.coerce.number().min(1, "Price must be greater than zero"),
  category: z.string().min(2),
  imageUrl: z.string().max(2_000_000).optional(),
  location: z.string().max(160).optional(),
  availability: z.enum(["In Stock", "Made to Order", "Limited"]).default("In Stock"),
  stock: z.coerce.number().min(1).max(100000).default(1),
  materials: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["active", "pending", "inactive"]).optional(),
});

const updateSchema = productSchema.partial().extend({
  status: z.enum(["active", "pending", "inactive"]).optional(),
  featured: z.boolean().optional(),
});

router.get(
  "/",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { category, search, location, sort, sellerId } = req.query as Record<string, string | undefined>;

    const products = await prisma.product.findMany({
      where: {
        ...(sellerId ? { sellerId } : {}),
        ...(category && category !== "all" ? { category } : {}),
        ...(location && location !== "all" ? { location: { contains: location, mode: "insensitive" } } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { tags: { has: search.toLowerCase() } },
              ],
            }
          : {}),
      },
      include: { seller: { select: { id: true, name: true } } },
      orderBy:
        sort === "price-asc"
          ? { price: "asc" }
          : sort === "price-desc"
          ? { price: "desc" }
          : sort === "rating"
          ? { rating: "desc" }
          : [{ featured: "desc" }, { createdAt: "desc" }],
      take: 200,
    });

    res.json(products.map(serializeProduct));
  })
);

router.get(
  "/:id",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { seller: { select: { id: true, name: true } } },
    });
    if (!product) throw ApiError.notFound("Product not found");
    res.json(serializeProduct(product));
  })
);

router.post(
  "/",
  authenticate,
  validate(productSchema),
  asyncHandler(async (req, res) => {
    const input = req.body as z.infer<typeof productSchema>;
    const seller = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!seller) throw ApiError.unauthorized();

    const product = await prisma.product.create({
      data: {
        name: input.name,
        description: input.description,
        price: input.price,
        category: input.category,
        imageUrl:
          input.imageUrl ||
          "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80",
        sellerId: seller.id,
        cooperativeId: seller.cooperativeId,
        location: input.location || seller.location,
        availability: AVAILABILITY_MAP[input.availability],
        stock: input.stock,
        materials: input.materials ?? [],
        tags: input.tags ?? [],
        status: (input.status as ProductStatus) || "active",
      },
      include: { seller: { select: { id: true, name: true } } },
    });

    res.status(201).json(serializeProduct(product));
  })
);

router.patch(
  "/:id",
  authenticate,
  validate(updateSchema),
  asyncHandler(async (req, res) => {
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing) throw ApiError.notFound("Product not found");

    const isOwner = existing.sellerId === req.user!.id;
    const isAdmin = req.user!.role !== "member";
    if (!isOwner && !isAdmin) throw ApiError.forbidden();

    const input = req.body as z.infer<typeof updateSchema>;
    const { availability, status, ...rest } = input;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        ...(availability ? { availability: AVAILABILITY_MAP[availability] } : {}),
        ...(status ? { status: status as ProductStatus } : {}),
      },
      include: { seller: { select: { id: true, name: true } } },
    });
    res.json(serializeProduct(product));
  })
);

router.delete(
  "/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing) throw ApiError.notFound("Product not found");
    if (existing.sellerId !== req.user!.id && req.user!.role === "member") {
      throw ApiError.forbidden();
    }
    await prisma.product.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

export default router;
