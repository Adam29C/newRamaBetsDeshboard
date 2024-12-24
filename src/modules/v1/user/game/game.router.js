import express from "express";
import {  gameById, allGames, gamesRates, gamesRatesById, starLineAllGames, getNumber, jackPotAllGames, cardList, addGameBids, gameResult, starGameResult } from "./game.controller.js";
import { roleList } from "../../../../consts/authorization.js";
import { verifyRoles } from "../../../../middlewares/verifyRoles.js";
import { ValidationSource, validator } from "../../../../middlewares/validator.js";
import { verifyToken } from "../../../../helpers/token.js";
import { gameByIdSchema, gameListSchema, gameSchema, gamesRatesByIdSchema } from "./game.schema.js";
import { GameResult } from "../../../../models/GameResult.js";

const gameRouters =express.Router();

gameRouters.post(
  "/allGames",
  //verifyToken,
  //validator(gameSchema,ValidationSource.BODY),
  allGames
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
  //validator(gameSchema,ValidationSource.BODY),
  gamesRates
);

gameRouters.post(
  "/gamesRatesById",
  verifyToken,
  validator(gamesRatesByIdSchema,ValidationSource.BODY),
  gamesRatesById
);

gameRouters.post(
  "/getNumber",
  verifyToken,
  validator(gameListSchema,ValidationSource.BODY),
  getNumber
);

gameRouters.post(
  "/starLineAllGames",
  verifyToken,
  validator(gameListSchema,ValidationSource.BODY),
  starLineAllGames
);

gameRouters.post(
  "/jackPotAllGames",
  verifyToken,
  // validator(gameListSchema,ValidationSource.BODY),
  jackPotAllGames
);

gameRouters.post(
  "/cardList",
  verifyToken,
  cardList
);

gameRouters.post(
  "/addGameBids",
  verifyToken,
  addGameBids
);

gameRouters.post(
  "/gameResult",
  verifyToken,
  gameResult
);

gameRouters.post(
  "/starGameResult",
  verifyToken,
  starGameResult
);

export {gameRouters}