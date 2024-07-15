import express from "express"
import {
  ValidationSource,
    validator,
  } from "../../../../middlewares/validator.js";
const adminDetailsRouters = express.Router();
import { verifyToken } from "../../../../helpers/token.js";
import {adminLogin,adminProfile,changePassword,createEmployee,blockEmployee,empList,addSystemInfo,updateSystemInfo,deleteEmployee,changeEmployeePassword,updateEmployeeInformition,getPermission,userList, countDashboard,todayRegisterUsers, updateGameStatus} from "./admin.controller.js";
import { roleList } from "../../../../consts/authorization.js";
import {verifyRoles} from "../../../../middlewares/verifyRoles.js";
import  getMulterStorage from "../../../../helpers/fileUpload.js";  
const systemInformition = getMulterStorage("uploads/systemInfo");
import { loginSchema,adminProfileSchema,changePasswordSchema,createEmployeeSchema,blockEmployeeSchema,empListSchema,updateSystemInfoSchema,deleteEmployeeSchema,updateEmployeeInformitionSchema,commonSchema, updateGameStatusSchema } from "./adminLogin.schema.js";

adminDetailsRouters.post(
  "/adminLogin",
  verifyToken,
  validator(loginSchema),
  adminLogin
);

adminDetailsRouters.get(
  "/adminProfile",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(adminProfileSchema,ValidationSource.QUERY),
  adminProfile   
);

adminDetailsRouters.post(
  "/changePassword",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(changePasswordSchema,ValidationSource.BODY),
  changePassword
);

adminDetailsRouters.post(
  "/createEmployee",
   verifyToken,
   verifyRoles(roleList.ADMIN),
  //  validator(createEmployeeSchema,ValidationSource.BODY),
   createEmployee
);

adminDetailsRouters.post(
  "/blockEmployee",
   verifyToken,
   verifyRoles(roleList.ADMIN),
   validator(blockEmployeeSchema,ValidationSource.BODY),
   blockEmployee
);

adminDetailsRouters.get(
  "/empList",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(empListSchema,ValidationSource.QUERY),
  empList
);

adminDetailsRouters.delete(
  "/deleteEmployee/:empId",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(deleteEmployeeSchema, ValidationSource.PARAM),
  deleteEmployee
);

adminDetailsRouters.post(
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

adminDetailsRouters.put(
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

adminDetailsRouters.put(
  "/changeEmployeePassword",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(changePasswordSchema,ValidationSource.BODY),
  changeEmployeePassword
);

adminDetailsRouters.put(
  "/updateEmployeeInformition",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(updateEmployeeInformitionSchema,ValidationSource.BODY),
  updateEmployeeInformition
);

adminDetailsRouters.get(
  "/getPermission/:id",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(commonSchema,ValidationSource.PARAM),
  getPermission
);

adminDetailsRouters.get(
  "/userList/:id",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(commonSchema, ValidationSource.PARAM),
  userList
);

adminDetailsRouters.get(
  "/countDashboard/:id",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(commonSchema, ValidationSource.PARAM),
  countDashboard
);

adminDetailsRouters.get(
  "/todayRegisterUsers/:id",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(commonSchema, ValidationSource.PARAM),
  todayRegisterUsers
);

adminDetailsRouters.put(
  "/updateGameStatus",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(updateGameStatusSchema, ValidationSource.BODY),
  updateGameStatus
);
export { adminDetailsRouters }; 