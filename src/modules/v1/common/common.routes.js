import express from 'express';
import { generateAuthToken } from './common.controller.js';
import { generateAuthTokenSchema } from './common.schema.js';
import { validator } from '../../../middlewares/validator.js';

const commonRouter = express.Router();

commonRouter.post("/generate-token", validator(generateAuthTokenSchema),generateAuthToken);

export { commonRouter };