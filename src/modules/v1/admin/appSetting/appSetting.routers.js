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

const appSettingRouters = express.Router();

// Ensure body parsers are used before multer
appSettingRouters.use(express.json());
appSettingRouters.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const tempDir = path.join(__dirname, '../../../../public/tempDirectory/');
        await fs.mkdir(tempDir, { recursive: true }); // Ensure directory exists
        cb(null, tempDir); // Temporary storage directory
    },
    filename: function (req, file, cb) {
        const originalname = file.originalname;
        const ext = path.extname(originalname);
        console.log(req.body.appVer, "hhhhhhhhhh");
        const filename = `Ramabets-V${req.body.appVer}${ext}`;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

appSettingRouters.put(
    '/updateVersionSetting',
    verifyToken,
    verifyRoles(roleList.ADMIN),
    upload.single('apk'),
    updateVersionSetting
);

appSettingRouters.get(
    '/listVersionSetting',
    verifyToken,
    verifyRoles(roleList.ADMIN),
    validator(listVersionSettingSchema, ValidationSource.QUERY),
    listVersionSetting
);

export { appSettingRouters };