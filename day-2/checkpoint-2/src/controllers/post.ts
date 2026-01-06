import { Request, Response } from "express";
import { prisma } from "../connection/client";

export const getPosts = async (_req: Request, res: Response) => {
  const posts = await prisma.post.findMany({ include: { User: true } });
  res.json({ message: "Posts retrieved successfully", data: posts });
};

export const getPostById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const post = await prisma.post.findUnique({
    where: { id },
    include: { User: true },
  });
  if (!post)
    return res
      .status(404)
      .json({ message: "Post not found", error: "Post not found" });
  res.json({ message: "Post retrieved successfully", data: post });
};

export const createPost = async (req: Request, res: Response) => {
  const { title, content, authorId } = req.body;
  const post = await prisma.post.create({
    data: { title, content, authorId },
  });
  res.json({ message: "Post created successfully", data: post });
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, content, published } = req.body;
    const post = await prisma.post.update({
      where: { id },
      data: { title, content, published },
    });

    res.json({ message: "Post updated successfully", data: post });
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await prisma.post.delete({ where: { id } });
  res.json({ message: "Post deleted successfully" });
};
