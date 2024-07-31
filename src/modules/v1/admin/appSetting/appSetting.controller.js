
import { findOne, insertQuery, deleteQuery, update, findAll } from '../../../../helpers/crudMongo.js';//update the version setting
import bcrypt from 'bcrypt';
import { HTTP_MESSAGE, InternalServerErrorResponse, SuccessResponse, BadRequestResponse, UnauthorizedResponse } from '../../../../helpers/http.js';
import Admin from '../../../../models/admin.js';
import System from '../../../../models/system.js';
import { createToken } from '../../../../helpers/token.js';

import { Users } from "../../../../models/users.js"
import { GameProvider } from '../../../../models/gameProvider.js';
import { VersionSetting } from '../../../../models/versionSetting.js';
import {WalletContact} from "../../../../models/walledContect.js"
import moment from 'moment';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const updateVersionSetting = async (req, res) => {
    try {
        const { adminId, type, versionId, status, appVer } = req.body;
        const file = req.file;

        // Fetch Admin ID to check if it exists
        const details = await findOne("Admin", { _id: adminId });
        if (!details) {
            return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
        }

        const versionInfo = await findOne("VersionSetting", { _id: versionId });
        if (!versionInfo) {
            return BadRequestResponse(res, HTTP_MESSAGE.VERSION_SETTING_NOT_FOUND);
        }

        let query = {};

        switch (type) {
            case '1':
                query = { forceUpdate: status };
                break;
            case '2':
                query = { maintainence: status };
                break;
            case '3':
                query = { appVersion: appVer };
                if (file && file.filename) {
                    query['apkFileName'] = file.filename;
                }
                break;
            default:
                return BadRequestResponse(res, "Invalid type");
        }

        if (type === '3' && file && file.filename) {
            const filePath = path.join(__dirname, '../../../../public/tempDirectory', file.filename);
            const destinationDir = path.join(__dirname, '../../../../public/apk');

            // Ensure the destination directory exists
            await fs.mkdir(destinationDir, { recursive: true });

            // Clear existing files in the destination directory
            const files = await fs.readdir(destinationDir);
            for (const existingFile of files) {
                await fs.unlink(path.join(destinationDir, existingFile));
            };

            // Move the file to the destination directory
            const destinationPath = path.join(destinationDir, file.filename);
            await fs.rename(filePath, destinationPath);
        }

        await update("VersionSetting", { _id: versionId }, { $set: query });
        return SuccessResponse(res, HTTP_MESSAGE.VERSION_SETTING_UPDATE);

    } catch (err) {
        return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
    }
};

const listVersionSetting = async (req, res) => {
    try {
        let { adminId } = req.query;

        //check if admin is exist
        const adminDetails = await findOne("Admin", { _id: adminId });
        if (!adminDetails) return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

        //get the all version list from the version setting table
        const list = await findAll("VersionSetting", {});
        return SuccessResponse(res, HTTP_MESSAGE.ALL_VERSION_SETTING_LIST, list);

    } catch (err) {
        return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
    }
};

const updateWalledContest = async (req, res) => {
    try {
        const { adminId, walledId,number ,headline ,upiId  } = req.body;
        // Fetch Admin ID to check if it exists
        const details = await findOne("Admin", { _id: adminId });
        if (!details) return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
        
        //Use walledInfo if it is exist
        const walledInfo = await findOne("WalletContact", { _id: walledId });
        if (!walledInfo) return BadRequestResponse(res, HTTP_MESSAGE.VERSION_SETTING_NOT_FOUND);
        
        //make the query for update
        let query = {};
        if(number) query={number}
        if(headline) query={headline}
        if(upiId) query ={upiId}

        await update("WalletContact", { _id: walledId }, { $set: query });
        return SuccessResponse(res, HTTP_MESSAGE.VERSION_SETTING_UPDATE);

    } catch (err) {
        return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
    }
};


export { updateVersionSetting, listVersionSetting, updateWalledContest };
