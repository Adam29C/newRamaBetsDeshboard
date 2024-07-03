import express from "express"
import {
  ValidationSource,
  validator,
} from "../../../../middlewares/validator.js";
import { verifyToken } from "../../../../helpers/token.js";
import { addGameProvider, deleteGameProvider, updateGameProvider,gameProviderList,gameProviderById } from "./game.controller.js";
import { roleList } from "../../../../consts/authorization.js";
import { verifyRoles } from "../../../../middlewares/verifyRoles.js";
import { gameSchema, deleteGameProviderSchema, updateGameProviderSchema,gameProviderListSchema,gameProviderIdSchema } from "./game.schema.js";
const gameDetailsRouters = express.Router();

gameDetailsRouters.post(
  "/gameProvider",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(gameSchema, ValidationSource.BODY),
  addGameProvider,
);

gameDetailsRouters.delete(
  "/gameProvider",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(deleteGameProviderSchema, ValidationSource.BODY),
  deleteGameProvider,
);

gameDetailsRouters.put(
  "/gameProvider",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(updateGameProviderSchema, ValidationSource.BODY),
  updateGameProvider,
);

gameDetailsRouters.get(
  "/gameProvider",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(gameProviderListSchema, ValidationSource.QUERY),
  gameProviderList,
);

gameDetailsRouters.get(
  "/gameProvider/:providerId",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(gameProviderIdSchema, ValidationSource.PARAM),
  gameProviderById,
);

export { gameDetailsRouters }; 