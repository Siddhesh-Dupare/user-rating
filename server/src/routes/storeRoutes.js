import { Router } from "express";
import {
  createStore,
  getStores,
  submitRating,
} from "../controllers/storeController.js";

const storeRouter = Router();

storeRouter.get("/", getStores);
storeRouter.post("/ratings", submitRating);
storeRouter.post("/", createStore);

export default storeRouter;
