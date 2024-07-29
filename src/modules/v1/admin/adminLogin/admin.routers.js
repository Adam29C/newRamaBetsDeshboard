import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";
import {
  ValidationSource,
  validator,
} from "../../../../middlewares/validator.js";
import { verifyToken } from "../../../../helpers/token.js";
import {
  adminLogin,
  adminProfile,
  changePassword,
  createEmployee,
  blockEmployee,
  empList,
  addSystemInfo,
  updateSystemInfo,
  deleteEmployee,
  changeEmployeePassword,
  updateEmployeeInformition,
  getPermission,
  userList,
  countDashboard,
  todayRegisterUsers,
  updateGameStatus,
  updateVersionSetting,
  listVersionSetting,
} from "./admin.controller.js";
import { roleList } from "../../../../consts/authorization.js";
import { verifyRoles } from "../../../../middlewares/verifyRoles.js";
import getMulterStorage from "../../../../helpers/fileUpload.js";
import {
  loginSchema,
  adminProfileSchema,
  changePasswordSchema,
  createEmployeeSchema,
  blockEmployeeSchema,
  empListSchema,
  updateSystemInfoSchema,
  deleteEmployeeSchema,
  updateEmployeeInformitionSchema,
  commonSchema,
  updateGameStatusSchema,
  updateVersionSettingSchema,
  listVersionSettingSchema,
} from "./adminLogin.schema.js";

// Get current directory in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const adminDetailsRouters = express.Router();
const systemInformition = getMulterStorage("uploads/systemInfo");

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const tempDir = path.join(__dirname, '../../../../../../public/tempDirectory/');
    await fs.mkdir(tempDir, { recursive: true }); // Ensure directory exists
    cb(null, tempDir); // Temporary storage directory
  },
  filename: function (req, file, cb) {
    const originalname = file.originalname;
    const ext = path.extname(originalname);
    const filename = `Ramabets-V${req.body.appVer}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

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
  validator(adminProfileSchema, ValidationSource.QUERY),
  adminProfile
);

adminDetailsRouters.post(
  "/changePassword",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(changePasswordSchema, ValidationSource.BODY),
  changePassword
);

adminDetailsRouters.post(
  "/createEmployee",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  // validator(createEmployeeSchema, ValidationSource.BODY),
  createEmployee
);

adminDetailsRouters.patch(
  "/blockEmployee",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(blockEmployeeSchema, ValidationSource.BODY),
  blockEmployee
);

adminDetailsRouters.get(
  "/empList",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(empListSchema, ValidationSource.QUERY),
  empList
);

adminDetailsRouters.delete(
  "/deleteEmployee",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(deleteEmployeeSchema, ValidationSource.BODY),
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
    { name: "logo" },
    { name: "favIcon" },
    { name: "backgroundImage" },
  ]),
  updateSystemInfo
);

adminDetailsRouters.put(
  "/changeEmployeePassword",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(changePasswordSchema, ValidationSource.BODY),
  changeEmployeePassword
);

adminDetailsRouters.put(
  "/updateEmployeeInformition",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(updateEmployeeInformitionSchema, ValidationSource.BODY),
  updateEmployeeInformition
);

adminDetailsRouters.get(
  "/getPermission/:id",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(commonSchema, ValidationSource.PARAM),
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

adminDetailsRouters.put(
  "/updateVersionSetting",
  upload.single('apk'),
  verifyToken,
  verifyRoles(roleList.ADMIN),
  // validator(updateVersionSettingSchema, ValidationSource.BODY),
  updateVersionSetting
);

adminDetailsRouters.get(
  "/listVersionSetting",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(listVersionSettingSchema, ValidationSource.QUERY),
  listVersionSetting
);

export { adminDetailsRouters };
