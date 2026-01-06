import { Request, Response } from "express";
import { posts, Post } from "../models/post-model";

export const getPosts = (req: Request, res: Response) => {
  res.json({ message: "Posts retrieved successfully", posts });
};

export const createPosts = (req: Request, res: Response) => {
  const { title, content } = req.body;
  if (!title) return res.status(400).json({ error: "title required" });

  const newPost = {
    id: posts.length + 1,
    title,
    content,
  };

  posts.push(newPost);

  res.status(201).json({ message: "Post created successfully", post: newPost });
};

export const updatePosts = (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const getId = posts.findIndex((post) => post.id === parseInt(id));
  posts[getId] = { id: parseInt(id), title, content };

  res.status(200).json({
    message: `Post with id ${id} updated successfully`,
    post: posts[getId],
  });
};

export const deletePosts = (req: Request, res: Response) => {
  const { id } = req.params;
  const getId = posts.findIndex((post) => post.id === parseInt(id));
  const deleted_post = posts.splice(getId, 1);
  res
    .status(200)
    .json({ message: `Post with id ${id} deleted successfully`, deleted_post });
};
