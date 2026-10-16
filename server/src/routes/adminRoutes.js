import { Router } from "express";
import {
  createAdmin,
  getAdminStats,
  getStoreOwners,
  getUsersAndAdmins,
} from "../controllers/adminController.js";

const adminRouter = Router();

adminRouter.get("/stats", getAdminStats);
adminRouter.get("/stores", getStoreOwners);
adminRouter.get("/users", getUsersAndAdmins);
adminRouter.post("/", createAdmin);

export default adminRouter;
