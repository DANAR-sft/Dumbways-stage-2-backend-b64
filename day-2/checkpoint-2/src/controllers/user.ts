import { Request, Response } from "express";
import { prisma } from "../connection/client";

export const getUsers = async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({ include: { Post: true } });
  res.json({ message: "Users retrieved successfully", data: users });
};

export const getUserById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id },
    include: { Post: true },
  });
  if (!user)
    return res
      .status(404)
      .json({ message: "User not found", error: "User not found" });
  res.json({ message: "User retrieved successfully", data: user });
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const user = await prisma.user.create({ data: { name, email } });
  res.json({ message: "User created successfully", data: user });
};

export const updateUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, email } = req.body;
  const user = await prisma.user.update({
    where: { id },
    data: { name, email },
  });
  res.json({ message: "User updated successfully", data: user });
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await prisma.user.delete({ where: { id } });
  res.json({ message: "User deleted successfully" });
};
