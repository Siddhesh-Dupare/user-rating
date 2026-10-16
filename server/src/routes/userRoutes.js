import { Router } from "express";
import { changePassword, createUser } from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/", createUser);
userRouter.patch("/password", changePassword);

export default userRouter;
