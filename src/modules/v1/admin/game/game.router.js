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
gameDetailsRouters.post(
"/addGameProvider",
verifyToken,
// verifyRoles(roleList.ADMIN),
addGameProvider
);
export { gameDetailsRouters }; 