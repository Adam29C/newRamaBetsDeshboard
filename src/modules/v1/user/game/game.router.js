import express from "express";
import {  gameById, games, gamesList, gamesRates, gamesRatesById } from "./game.controller.js";
import { roleList } from "../../../../consts/authorization.js";
import { verifyRoles } from "../../../../middlewares/verifyRoles.js";
import { ValidationSource, validator } from "../../../../middlewares/validator.js";
import { verifyToken } from "../../../../helpers/token.js";
import { gameByIdSchema, gameListSchema, gameSchema, gamesRatesByIdSchema } from "./game.schema.js";

const gameRouters =express.Router();

gameRouters.post(
  "/games",
  verifyToken,
  validator(gameSchema,ValidationSource.BODY),
  games
);

gameRouters.post(
  "/gameById",
  verifyToken,
  validator(gameByIdSchema,ValidationSource.BODY),
  gameById
);

gameRouters.post(
  "/gamesRates",
  verifyToken,
  validator(gameSchema,ValidationSource.BODY),
  gamesRates
);

gameRouters.post(
  "/gamesRatesById",
  verifyToken,
  validator(gamesRatesByIdSchema,ValidationSource.BODY),
  gamesRatesById
);

gameRouters.post(
  "/gameList",
  verifyToken,
  validator(gameListSchema,ValidationSource.BODY),
  gamesList
);
export {gameRouters}