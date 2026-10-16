import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import storeRouter from "./routes/storeRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import storeOwnerRouter from "./routes/storeOwnerRoutes.js";
import { ensureRatingsTable, ensureRoleScopedEmailConstraint } from "./db.js";

const server = express();
const PORT = 5000;

server.use(express.json());
server.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
server.use("/api/auth", authRouter);
server.use("/api/user", userRouter);
server.use("/api/store", storeRouter);
server.use("/api/admin", adminRouter);
server.use("/api/store-owner", storeOwnerRouter);

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  Promise.all([ensureRatingsTable(), ensureRoleScopedEmailConstraint()]).catch((error) => {
    console.error("Unable to initialize ratings table", error);
  });
});
