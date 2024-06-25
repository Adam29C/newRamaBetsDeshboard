import express from "express"
const adminRouter = express.Router();
import { verifyToken } from "../../../helpers/token.js";
import {adminLogin,adminProfile,changePassword,createEmployee,blockEmployee,empList} from "./admin.controller.js";

adminRouter.post("/adminLogin",verifyToken,adminLogin);
adminRouter.get("/adminProfile",verifyToken,adminProfile);
adminRouter.post("/changePassword",verifyToken,changePassword);
adminRouter.post("/createEmployee",verifyToken,createEmployee);
adminRouter.post("/blockEmployee",verifyToken,blockEmployee);
adminRouter.get("/empList",verifyToken,empList);



export { adminRouter }; 