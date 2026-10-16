import { Router } from "express";
import { createStore, getStores } from "../controllers/storeController.js";

const storeRouter = Router();

storeRouter.get("/", getStores);
storeRouter.post("/", createStore);

export default storeRouter;
