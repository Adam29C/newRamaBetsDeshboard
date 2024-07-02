import express from "express";
import {gameDetailsRouters} from "./gameProvider/game.router.js"
import { gameSettingRouters } from "./gameSetting/gameSetting.router.js";
const adminRouter = express.Router();

adminRouter.use("/game",gameDetailsRouters);
adminRouter.use("/game",gameSettingRouters);


export { adminRouter };