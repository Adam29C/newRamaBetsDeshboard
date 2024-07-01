import express from "express"
import {
  ValidationSource,
    validator,
  } from "../../../../middlewares/validator.js";
const gameDetailsRouters = express.Router();
import { verifyToken } from "../../../../helpers/token.js";
import {addGameProvider} from "./game.controller.js";
import { roleList } from "../../../../consts/authorization.js";
import {verifyRoles} from "../../../../middlewares/verifyRoles.js";
import { gameSchema } from "./game.schema.js";
gameDetailsRouters.post(
"/addGameProvider",
verifyToken,
verifyRoles(roleList.ADMIN,roleList.SUBADMIN),
addGameProvider,
validator(gameSchema, ValidationSource.PARAM),
);
export { gameDetailsRouters }; 