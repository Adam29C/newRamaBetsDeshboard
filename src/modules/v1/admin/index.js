import express from "express";
import { adminDetailsRouters } from "./adminLogin/admin.routers.js";
const adminRouter = express.Router();

adminRouter.use("/admin",adminDetailsRouters);

export { adminRouter };