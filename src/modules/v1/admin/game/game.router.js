import express from "express"
import {
  ValidationSource,
  validator,
} from "../../../../middlewares/validator.js";
const gameDetailsRouters = express.Router();
import { verifyToken } from "../../../../helpers/token.js";
import { addGameProvider, deleteGameProvider, updateGameProvider,gameProviderList,gameProviderById } from "./game.controller.js";
import { roleList } from "../../../../consts/authorization.js";
import { verifyRoles } from "../../../../middlewares/verifyRoles.js";
import { gameSchema, deleteGameProviderSchema, updateGameProviderSchema,gameProviderListSchema,gameProviderIdSchema } from "./game.schema.js";

gameDetailsRouters.post(
  "/addGameProvider",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(gameSchema, ValidationSource.BODY),
  addGameProvider,
);

gameDetailsRouters.delete(
  "/deleteGameProvider",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(deleteGameProviderSchema, ValidationSource.BODY),
  deleteGameProvider,
);

gameDetailsRouters.put(
  "/updateGameProvider",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(updateGameProviderSchema, ValidationSource.BODY),
  updateGameProvider,
);

gameDetailsRouters.get(
  "/gameProviderList/:adminId",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(gameProviderListSchema, ValidationSource.PARAM),
  gameProviderList,
);

gameDetailsRouters.get(
  "/gameProviderById/:gameProviderId",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(gameProviderIdSchema, ValidationSource.PARAM),
  gameProviderById,
);

export { gameDetailsRouters }; 