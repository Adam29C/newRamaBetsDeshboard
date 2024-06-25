import express from "express"
const adminRouter = express.Router();
import {adminLogin} from "./admin.controller.js";
import { verifyToken } from "../../../helpers/token.js";
adminRouter.post("/adminLogin",verifyToken,adminLogin);
export { adminRouter }; 