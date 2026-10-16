import { Router } from "express";
import { getStoreOwnerRatings } from "../controllers/storeController.js";

const storeOwnerRouter = Router();

storeOwnerRouter.get("/ratings", getStoreOwnerRatings);

export default storeOwnerRouter;
