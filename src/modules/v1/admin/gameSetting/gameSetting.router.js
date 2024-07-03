import express from "express"
import {
  ValidationSource,
  validator,
} from "../../../../middlewares/validator.js";
import { verifyToken } from "../../../../helpers/token.js";
import { addGameSetting, updateGameSetting,deleteGameSetting, gameSettingList, gameSettingById} from "./gameSetting.controller.js";
//deleteGameProvider, updateGameProvider,gameProviderList,gameProviderById
import { roleList } from "../../../../consts/authorization.js";
import { verifyRoles } from "../../../../middlewares/verifyRoles.js";
import { gameSettingSchema, deleteGameSettingSchema, updateGameSettingSchema,gameProviderListSchema,gameProviderIdSchema } from "./gameSetting.schema.js";
const gameSettingRouters = express.Router();

gameSettingRouters.post(
  "/gameSetting",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(gameSettingSchema, ValidationSource.BODY),
  addGameSetting,
);

gameSettingRouters.put(
  "/gameSetting",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(updateGameSettingSchema, ValidationSource.BODY),
  updateGameSetting,
);

gameSettingRouters.delete(
  "/gameSetting",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(deleteGameSettingSchema, ValidationSource.BODY),
  deleteGameSetting,
);

gameSettingRouters.get(
  "/gameSetting",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(gameProviderListSchema, ValidationSource.QUERY),
  gameSettingList,
);

gameSettingRouters.get(
  "/gameSetting/:gameSettingId",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(gameProviderIdSchema, ValidationSource.PARAM),
  gameSettingById,
);

export { gameSettingRouters }; 