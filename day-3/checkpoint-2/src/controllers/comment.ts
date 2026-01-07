import { Request, Response } from "express";
import prisma from "../prisma/client";

// GET /posts/:id/comments?page=1&limit=3
export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const message = "berhasil mengambil komentar";
    const postId = Number(req.params.id);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const comments = await prisma.comment.findMany({
      where: { postId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.comment.count({ where: { postId } });

    res.json({
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: comments,
      message,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengambil komentar" });
  }
};

// GET /posts/comments-summary?page=1&limit=5&minComments=2
export const getCommentsSummary = async (req: Request, res: Response) => {
  try {
    const message = "berhasil mengambil summary komentar";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const minComments = Number(req.query.minComments) || 0;
    const skip = (page - 1) * limit;

    const grouped = await prisma.comment.groupBy({
      by: ["postId"],
      _count: { id: true },
      orderBy: { postId: "asc" },
    });

    const filtered = grouped.filter((g) => g._count.id > minComments);
    const paginated = filtered.slice(skip, skip + limit);

    const withPostInfo = await Promise.all(
      paginated.map(async (g) => {
        const post = await prisma.post.findUnique({
          where: { id: g.postId },
          select: { id: true, title: true },
        });
        return {
          post,
          totalComments: g._count.id,
        };
      })
    );

    res.json({
      meta: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
      },
      data: withPostInfo,
      message,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengambil summary komentar" });
  }
};
