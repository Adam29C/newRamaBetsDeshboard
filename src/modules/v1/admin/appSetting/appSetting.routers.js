import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { roleList } from "../../../../consts/authorization.js";
import { verifyRoles } from "../../../../middlewares/verifyRoles.js";
import {
  ValidationSource,
  validator,
} from "../../../../middlewares/validator.js";
import { verifyToken } from "../../../../helpers/token.js";
import { listVersionSetting, updateVersionSetting } from "./appSetting.controller.js";
import getMulterStorage from "../../../../helpers/fileUpload.js";
import { listVersionSettingSchema } from "./appSetting.schema.js";
// Get current directory in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const adminDetailsRouters = express.Router();
const systemInformition = getMulterStorage("uploads/systemInfo");

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const tempDir = path.join(__dirname, '../../../../public/tempDirectory/');
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

const appSettingRouters = express.Router();

appSettingRouters.put(
  "/updateVersionSetting",
  upload.single('apk'),
  verifyToken,
  verifyRoles(roleList.ADMIN),
  // validator(updateVersionSettingSchema, ValidationSource.BODY),
  updateVersionSetting
);

appSettingRouters.get(
  "/listVersionSetting",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(listVersionSettingSchema, ValidationSource.QUERY),
  listVersionSetting
);


export { appSettingRouters }; 