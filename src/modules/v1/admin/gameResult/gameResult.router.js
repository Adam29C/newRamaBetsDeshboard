import express from "express"
import {
  ValidationSource,
  validator,
} from "../../../../middlewares/validator.js";
import { verifyToken } from "../../../../helpers/token.js";
//deleteGameProvider, updateGameProvider,gameProviderList,gameProviderById
import { roleList } from "../../../../consts/authorization.js";
import { verifyRoles } from "../../../../middlewares/verifyRoles.js";
import { addGameResult, getGameResult } from "./gameResult.controller.js";
import { addGameResultSchema, getGameResultSchema} from "./gameResult.schema.js";

const gameResultRouters = express.Router();
gameResultRouters.post(
  "/gameResult",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(addGameResultSchema, ValidationSource.BODY),
  addGameResult
);

gameResultRouters.post(
  "/gameResult",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(getGameResultSchema, ValidationSource.BODY),
  getGameResult
);

export { gameResultRouters }; 
