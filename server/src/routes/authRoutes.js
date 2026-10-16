import { Router } from "express";
import { loginAdministrator } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/login", loginAdministrator);

export default authRouter;
