import { Request, Response } from "express";
import prisma from "../prisma/client";

export const getOrderSummary = async (req: Request, res: Response) => {
  const message = "berhasil mengambil data summary orders";

  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const groupedOrders = await prisma.order.groupBy({
      by: ["userId"],
      _sum: { quantity: true },
      _count: { id: true },
      orderBy: { userId: "asc" },
      skip,
      take: limit,
    });

    const totalUsers = await prisma.order.groupBy({
      by: ["userId"],
      _sum: { quantity: true },
    });

    const withUserInfo = await Promise.all(
      groupedOrders.map(
        async (g: {
          userId: number;
          _sum: { quantity: number | null };
          _count: { id: number };
        }) => {
          const user = await prisma.user.findUnique({
            where: { id: g.userId },
            select: { id: true, name: true, email: true },
          });
          return {
            user,
            totalQuantity: g._sum.quantity ?? 0,
            totalOrders: g._count.id,
          };
        }
      )
    );

    res.json({
      meta: {
        page,
        limit,
        totalUsers: totalUsers.length,
        totalPages: Math.ceil(totalUsers.length / limit),
      },
      data: withUserInfo,
      message,
    });
  } catch (error) {
    console.error("❌ Error in getOrderSummary:", error);
    res
      .status(500)
      .json({ error: "Terjadi kesalahan saat mengambil data summary orders" });
  }
};
