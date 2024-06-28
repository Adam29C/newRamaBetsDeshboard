import express from "express"
import {
  ValidationSource,
    validator,
  } from "../../../../middlewares/validator.js";
const adminRouter = express.Router();
import { verifyToken } from "../../../../helpers/token.js";
import {adminLogin,adminProfile,changePassword,createEmployee,blockEmployee,empList,addSystemInfo,updateSystemInfo,deleteEmployee,changeEmployeePassword,updateEmployeeInformition,getPermission,userList} from "./admin.controller.js";
import { roleList } from "../../../../consts/authorization.js";
import {verifyRoles} from "../../../../middlewares/verifyRoles.js";
import  getMulterStorage from "../../../../helpers/fileUpload.js";
const systemInformition = getMulterStorage("uploads/systemInfo");

import { loginSchema,adminProfileSchema,changePasswordSchema,createEmployeeSchema,blockEmployeeSchema,empListSchema,updateSystemInfoSchema,deleteEmployeeSchema,updateEmployeeInformitionSchema,commonSchema } from "./adminLogin.schema.js";
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
  validator(empListSchema,ValidationSource.QUERY),
  empList
);

adminRouter.delete(
  "/deleteEmployee/:empId",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(deleteEmployeeSchema, ValidationSource.PARAM),
  deleteEmployee
);

adminRouter.post(
  "/addSystemInfo",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  systemInformition.fields([
    { name: "logo" },
    { name: "favIcon" },
    { name: "backgroundImage" },
  ]),
  validator(updateSystemInfoSchema, ValidationSource.BODY),
  addSystemInfo
);

adminRouter.put(
  "/updateSystemInfo",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  systemInformition.fields([
    {name:"logo"},
    {name:"favIcon"},
    {name:"backgroundImage"},
  ]),
  updateSystemInfo
);
//changeEmployeePassword
adminRouter.put(
  "/changeEmployeePassword",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(changePasswordSchema,ValidationSource.BODY),
  changeEmployeePassword
);

adminRouter.put(
  "/updateEmployeeInformition",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(updateEmployeeInformitionSchema,ValidationSource.BODY),
  updateEmployeeInformition
);

adminRouter.get(
  "/getPermission/:id",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(commonSchema,ValidationSource.PARAM),
  getPermission
);

adminRouter.get(
  "/userList/:id",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(commonSchema, ValidationSource.PARAM),
  userList
);

export { adminRouter }; 