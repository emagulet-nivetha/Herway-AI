import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { authenticate, optionalAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { serializePost } from "../utils/serialize";

const router = Router();

const createPostSchema = z.object({
  content: z.string().min(5, "Please write a little more").max(4000),
  tags: z.array(z.string()).max(10).optional(),
});

const commentSchema = z.object({
  content: z.string().min(1).max(1000),
});

const postInclude = {
  author: { select: { id: true, name: true, avatarUrl: true } },
  comments: {
    include: { author: { select: { id: true, name: true, avatarUrl: true } } },
    orderBy: { createdAt: "asc" as const },
  },
} as const;

router.get(
  "/posts",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const search = typeof req.query.search === "string" ? req.query.search : "";
    const posts = await prisma.post.findMany({
      where: search
        ? {
            OR: [
              { content: { contains: search, mode: "insensitive" } },
              { tags: { has: search.toLowerCase() } },
              { author: { name: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {},
      include: postInclude,
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    res.json(posts.map((p) => serializePost(p)));
  })
);

router.post(
  "/posts",
  authenticate,
  validate(createPostSchema),
  asyncHandler(async (req, res) => {
    const input = req.body as z.infer<typeof createPostSchema>;
    const post = await prisma.post.create({
      data: {
        authorId: req.user!.id,
        content: input.content,
        tags: (input.tags || []).map((t) => t.trim().toLowerCase()).filter(Boolean),
        type: "post",
      },
      include: postInclude,
    });
    res.status(201).json(serializePost(post));
  })
);

router.post(
  "/posts/:id/like",
  authenticate,
  asyncHandler(async (req, res) => {
    const existing = await prisma.post.findUnique({ where: { id: req.params.id } });
    if (!existing) throw ApiError.notFound("Post not found");
    const post = await prisma.post.update({
      where: { id: req.params.id },
      data: { likes: { increment: 1 } },
      include: postInclude,
    });
    res.json(serializePost(post, true));
  })
);

router.post(
  "/posts/:id/comments",
  authenticate,
  validate(commentSchema),
  asyncHandler(async (req, res) => {
    const { content } = req.body as z.infer<typeof commentSchema>;
    const existing = await prisma.post.findUnique({ where: { id: req.params.id } });
    if (!existing) throw ApiError.notFound("Post not found");

    await prisma.comment.create({
      data: { postId: req.params.id, authorId: req.user!.id, content },
    });
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      include: postInclude,
    });
    res.status(201).json(serializePost(post!));
  })
);

export default router;
