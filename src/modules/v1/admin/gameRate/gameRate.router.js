import express from "express"
import {
  ValidationSource,
  validator,
} from "../../../../middlewares/validator.js";
import { verifyToken } from "../../../../helpers/token.js";
//deleteGameProvider, updateGameProvider,gameProviderList,gameProviderById
import { roleList } from "../../../../consts/authorization.js";
import { verifyRoles } from "../../../../middlewares/verifyRoles.js";
import { addGameReteSchema, updateGameReteSchema, deleteGameRateSchema, gameRateListSchema, gameReteByIdSchema} from "./gameRate.schema.js";
import { addGameRate,deleteGameRate,gameRateById,gameRateList,updateGameRate } from "./gameRate.controller.js";

const gameRateRouters = express.Router();
gameRateRouters.post(
  "/gameRate",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(addGameReteSchema, ValidationSource.BODY),
  addGameRate
);

gameRateRouters.put(
  "/gameRate",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(updateGameReteSchema, ValidationSource.BODY),
  updateGameRate,
);

gameRateRouters.delete(
  "/gameRate",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(deleteGameRateSchema, ValidationSource.BODY),
  deleteGameRate,
);

gameRateRouters.get(
  "/gameRate",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(gameRateListSchema, ValidationSource.QUERY),
  gameRateList,
);

gameRateRouters.get(
  "/gameRate/:gameRateId",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(gameReteByIdSchema, ValidationSource.PARAM),
  gameRateById
);

export { gameRateRouters }; 
