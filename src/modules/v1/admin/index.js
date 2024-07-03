import express from "express";
import {gameDetailsRouters} from "./gameProvider/game.router.js"
import { gameSettingRouters } from "./gameSetting/gameSetting.router.js";
import { gameRateRouters } from "./gameRate/gameRate.router.js";

const adminRouter = express.Router();

adminRouter.use("/game",gameDetailsRouters);
adminRouter.use("/game",gameSettingRouters);
adminRouter.use("/game",gameRateRouters);

export { adminRouter };