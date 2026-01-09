import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token tidak ditemukan" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: "Token tidak valid" });
  }
};

export const authorize = (role: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ error: "Tidak memiliki izin" });
    }
    next();
  };
};
