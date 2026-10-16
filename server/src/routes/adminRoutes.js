import { Router } from "express";
import {
  createAdmin,
  getAdminStats,
} from "../controllers/adminController.js";

const adminRouter = Router();

adminRouter.get("/stats", getAdminStats);
adminRouter.post("/", createAdmin);

export default adminRouter;
