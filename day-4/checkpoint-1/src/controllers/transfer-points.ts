import { Response, Request } from "express";
import prisma from "../prisma/client";

export const transferPoints = async (
  req: Request,
  res: Response,
  next: any
) => {
  const { amount, senderId, receiverId } = req.body;
  const pesan = "berhasil mentransfer point";

  try {
    if (amount <= 0) {
      throw { status: 400, message: "jumlah point harus lebih dari 0" };
    }

    const [sender, receiver] = await Promise.all([
      prisma.user.findUnique({ where: { id: senderId } }),
      prisma.user.findUnique({ where: { id: receiverId } }),
    ]);

    if (!sender) throw { status: 400, message: "Pengirim tidak ditemukan" };
    if (!receiver) throw { status: 404, message: "Penerima tidak ditemukan" };

    if (sender.points < amount) {
      throw { status: 400, message: "Point tidak mencukupi" };
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: senderId },
        data: { points: { decrement: amount } },
      });

      await tx.user.update({
        where: { id: receiverId },
        data: { points: { increment: amount } },
      });
    });
    res.json(pesan);
  } catch (error) {
    next(error);
  }
};

export const userPoints = async (req: Request, res: Response, next: any) => {
  try {
    const userId = Number(req.params.id);
    const userPoints = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        points: true,
      },
    });

    res.status(200).json({ message: "data ditemukan", data: userPoints });
  } catch (error) {
    next(error);
  }
};
