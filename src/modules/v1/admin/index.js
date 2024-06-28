import express from "express";
import { adminDetailsRouters } from "./adminLogin/admin.routers.js";
import {gameDetailsRouters} from "./game/game.router.js"
const adminRouter = express.Router();

adminRouter.use("/admin",adminDetailsRouters);
adminRouter.use("/game",gameDetailsRouters);

export { adminRouter };