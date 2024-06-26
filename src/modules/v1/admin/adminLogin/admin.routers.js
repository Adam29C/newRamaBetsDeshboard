import express from "express"
import {
  ValidationSource,
    validator,
  } from "../../../../middlewares/validator.js";
const adminRouter = express.Router();
import { verifyToken } from "../../../../helpers/token.js";
import {adminLogin,adminProfile,changePassword,createEmployee,blockEmployee,empList} from "./admin.controller.js";
import { roleList } from "../../../../consts/authorization.js";
import {verifyRoles} from "../../../../middlewares/verifyRoles.js"
import { loginSchema,adminProfileSchema,changePasswordSchema,createEmployeeSchema,blockEmployeeSchema,empListSchema } from "./adminLogin.schema.js";
adminRouter.post(
  "/adminLogin",
  verifyToken,
  validator(loginSchema),
  adminLogin
);
adminRouter.get(
  "/adminProfile",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(adminProfileSchema,ValidationSource.QUERY),
  adminProfile   
);
adminRouter.post(
  "/changePassword",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(changePasswordSchema,ValidationSource.BODY),
  changePassword
);
adminRouter.post(
  "/createEmployee",
   verifyToken,
   verifyRoles(roleList.ADMIN),
  //  validator(createEmployeeSchema,ValidationSource.BODY),
   createEmployee
);
adminRouter.post(
  "/blockEmployee",
   verifyToken,
   verifyRoles(roleList.ADMIN),
   validator(blockEmployeeSchema,ValidationSource.BODY),
   blockEmployee
);
adminRouter.get(
  "/empList",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(empListSchema,ValidationSource.BODY),
  empList
);

export { adminRouter }; 