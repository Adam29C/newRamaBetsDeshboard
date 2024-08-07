import express from "express";
import {gameDetailsRouters} from "./gameProvider/game.router.js"
import { gameSettingRouters } from "./gameSetting/gameSetting.router.js";
import { gameRateRouters } from "./gameRate/gameRate.router.js";
import { gameResultRouters } from "./gameResult/gameResult.router.js";
import { appSettingRouters } from "./appSetting/appSetting.routers.js";
import { mastersRouters } from "./masters/master.router.js";
const   adminRouter = express.Router();

adminRouter.use("/game",gameDetailsRouters);
adminRouter.use("/game",gameSettingRouters);
adminRouter.use("/game",gameRateRouters);
adminRouter.use("/game",gameResultRouters);
adminRouter.use("/appSetting",appSettingRouters)
adminRouter.use("/master",mastersRouters)
adminRouter.use("/wallet",walletRouters)
export { adminRouter };