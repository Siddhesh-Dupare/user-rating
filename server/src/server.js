import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";

const server = express();
const PORT = 5000;

server.use(express.json());
server.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
server.use("/api/auth", authRouter);

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
