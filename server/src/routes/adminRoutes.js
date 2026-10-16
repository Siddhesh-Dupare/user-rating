import { Router } from "express";
import { createAdmin } from "../controllers/adminController.js";

const adminRouter = Router();

adminRouter.post("/", createAdmin);

export default adminRouter;
