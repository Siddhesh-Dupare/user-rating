import { Router } from "express";
import {
  createAdmin,
  getAdminStats,
  getStoreOwners,
} from "../controllers/adminController.js";

const adminRouter = Router();

adminRouter.get("/stats", getAdminStats);
adminRouter.get("/stores", getStoreOwners);
adminRouter.post("/", createAdmin);

export default adminRouter;
