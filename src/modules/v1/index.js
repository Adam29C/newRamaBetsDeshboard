import express from "express";
import { commonRouter } from "./common/common.routes.js";
import {adminRouter} from "./admin/index.js"
import { adminDetailsRouters } from "./admin/adminLogin/admin.routers.js";


const versionOneRouter = express.Router();

versionOneRouter.use("/common", commonRouter);
versionOneRouter.use("/admin",adminRouter)
versionOneRouter.use("/admin",adminDetailsRouters);


export { versionOneRouter };