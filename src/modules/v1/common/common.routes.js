import express from 'express';
import { generateAuthToken } from './common.controller.js';

const commonRouter = express.Router();

commonRouter.post("/generate-token", generateAuthToken);

export { commonRouter };