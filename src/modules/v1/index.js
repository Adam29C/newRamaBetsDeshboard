import express from "express";
import { commonRouter } from "./common/common.routes.js";
import {adminRouter} from "./admin/index.js"


const versionOneRouter = express.Router();

versionOneRouter.use("/common", commonRouter);
versionOneRouter.use("/admin",adminRouter)

export { versionOneRouter };