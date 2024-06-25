import express from "express"
const adminRouter = express.Router();
import { verifyToken } from "../../../helpers/token.js";
import {adminLogin,adminProfile,changePassword} from "./admin.controller.js";

adminRouter.post("/adminLogin",verifyToken,adminLogin);
adminRouter.get("/adminProfile",verifyToken,adminProfile);
adminRouter.post("/changePassword",verifyToken,changePassword);

export { adminRouter }; 