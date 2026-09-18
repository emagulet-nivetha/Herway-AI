import { Router } from "express";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { serializeCooperative } from "../utils/serialize";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const coops = await prisma.cooperative.findMany({ orderBy: { createdAt: "asc" } });
    res.json(coops.map(serializeCooperative));
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const coop = await prisma.cooperative.findUnique({ where: { id: req.params.id } });
    if (!coop) throw ApiError.notFound("Cooperative not found");
    res.json(serializeCooperative(coop));
  })
);

export default router;
