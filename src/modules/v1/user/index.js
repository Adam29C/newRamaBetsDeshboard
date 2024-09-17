import express from "express";
import { userLoginRouter } from "./userLogin/user.router.js";
import { fundRouter } from "./fund/fund.router.js";
import { gameRouters } from "./game/game.router.js";
const userRouter =express.Router();

userRouter.use("/fund",fundRouter);
userRouter.use("/games",gameRouters);
export{userRouter}