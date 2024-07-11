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
import { addGameResultSchema, getGameResultSchema } from "./gameResult.schema.js";

const gameResultRouters = express.Router();
gameResultRouters.post(
  "/gameResult",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(addGameResultSchema, ValidationSource.BODY),
  addGameResult
);

gameResultRouters.get(
  "/gameResult",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(getGameResultSchema, ValidationSource.QUERY),
  getGameResult
);

// gameResultRouters.put(
//   "/gameResult",
//   verifyToken,
//   verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
//   validator(updateGameReteSchema, ValidationSource.BODY),
//   updateGameRate,
// );

// gameResultRouters.delete(
//   "/gameResult",
//   verifyToken,
//   verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
//   validator(deleteGameRateSchema, ValidationSource.BODY),
//   deleteGameRate,
// );

// gameResultRouters.get(
//   "/gameResult",
//   verifyToken,
//   verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
//   validator(gameRateListSchema, ValidationSource.QUERY),
//   gameRateList,
// );

// gameResultRouters.get(
//   "/gameResult/:gameResultId",
//   verifyToken,
//   verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
//   validator(gameReteByIdSchema, ValidationSource.PARAM),
//   gameRateById
// );

export { gameResultRouters }; 
