import express from "express";
import {  games, gamesRates } from "./game.controller.js";
import { roleList } from "../../../../consts/authorization.js";
import { verifyRoles } from "../../../../middlewares/verifyRoles.js";
import { ValidationSource, validator } from "../../../../middlewares/validator.js";
import { verifyToken } from "../../../../helpers/token.js";
import { gameSchema } from "./game.schema.js";

const gameRouters =express.Router();

gameRouters.post(
  "/games",
  verifyToken,
  validator(gameSchema,ValidationSource.BODY),
  games
);

gameRouters.post(
  "/gamesRates",
  verifyToken,
  validator(gameSchema,ValidationSource.BODY),
  gamesRates
);

export {gameRouters}