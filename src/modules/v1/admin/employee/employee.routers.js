import express from "express"
const adminRouter = express.Router();
import { verifyToken } from "../../../helpers/token.js";
import {adminLogin,adminProfile,changePassword,createEmployee,blockEmployee,empList} from "./employee.controller.js";
import { roleList } from "../../../consts/authorization.js";
import {verifyRoles} from "../../../middlewares/verifyRoles.js"

adminRouter.post("/adminLogin",verifyToken,verifyRoles(roleList.USER),adminLogin);
adminRouter.get("/adminProfile",verifyToken,verifyRoles(roleList.ADMIN,roleList.SUBADMIN),adminProfile);
adminRouter.post("/changePassword",verifyToken,verifyToken,verifyRoles(roleList.ADMIN),changePassword);
adminRouter.post("/createEmployee",verifyToken,verifyRoles(roleList.ADMIN),createEmployee);
adminRouter.post("/blockEmployee",verifyToken,verifyRoles(roleList.ADMIN),blockEmployee);
adminRouter.get("/empList",verifyToken,verifyRoles(roleList.ADMIN),empList);





export { adminRouter }; 