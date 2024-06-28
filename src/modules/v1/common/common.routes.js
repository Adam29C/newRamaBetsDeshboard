import express from 'express';
import { generateAuthToken, systemInforList } from './common.controller.js';
import { generateAuthTokenSchema } from './common.schema.js';
import { validator } from '../../../middlewares/validator.js';
import {verifyToken} from "../../../helpers/token.js"


const commonRouter = express.Router();

commonRouter.post("/generate-token", validator(generateAuthTokenSchema),generateAuthToken);
commonRouter.post("/systemInforList",verifyToken, systemInforList);

export { commonRouter };