import express from 'express';
import { versionOneRouter } from './v1/index.js';

const mainRouter = express.Router();

mainRouter.use("/v1", versionOneRouter);

export { mainRouter };