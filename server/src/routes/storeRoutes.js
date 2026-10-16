import { Router } from "express";
import { createStore } from "../controllers/storeController.js";

const storeRouter = Router();

storeRouter.post("/", createStore);

export default storeRouter;
