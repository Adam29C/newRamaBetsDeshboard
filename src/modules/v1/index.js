import express from "express";
import { commonRouter } from "./common/common.routes.js";


const versionOneRouter = express.Router();

versionOneRouter.use("/common", commonRouter);

export { versionOneRouter };