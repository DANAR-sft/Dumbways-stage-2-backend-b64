import cors from "cors";

const corsMiddleware = cors({
  origin: "http://localhost:1000",
  credentials: true,
});

export default corsMiddleware;
