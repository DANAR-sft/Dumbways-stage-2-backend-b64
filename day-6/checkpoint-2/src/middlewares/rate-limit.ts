import rateLimit from "express-rate-limit";

export const rateLimitMiddleware = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: "Terlalu banyak request dari IP ini, coba lagi nanti.",
});
