import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  max: 5,
  message: "Terlalu banyak request, coba lagi nanti.",
});
