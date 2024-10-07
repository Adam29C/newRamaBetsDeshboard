import {
  findAll,
  findOne,
  insertQuery,
  update,
} from "../../../../helpers/crudMongo.js";
import moment from "moment";
import {
  BadRequestResponse,
  HTTP_MESSAGE,
  InternalServerErrorResponse,
  SuccessResponse,
} from "../../../../helpers/http.js";

import { GameSetting } from "../../../../models/gameSetting.js";
import { GameRate } from "../../../../models/gameRates.js";
import { GameProvider } from "../../../../models/gameProvider.js";
import dateTime from "node-datetime";
import { WalletContact } from "../../../../models/walledContect.js";
import { result } from "../../../../helpers/gameResult.js";
import { Card } from "../../../../models/card.js";
import { Users } from "../../../../models/users.js";
import { validateBidTime } from "../../../../helpers/validateTime.js";
import { insertBidHistory } from "../../../../helpers/insertBid.js";
import { gameBid } from "../../../../models/gameBid.js";

const allGames = async (req, res) => {
  try {
    const { userId } = req.body;
    const userDetails = await findOne("Users", { _id: userId });
    if (!userDetails)
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

    let gameType = "MainGame";
    let arrayFinal = await result(gameType);
    return SuccessResponse(res, HTTP_MESSAGE.ALL_GAME_LIST, arrayFinal);
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

const starLineAllGames = async (req, res) => {
  try {
    const { userId } = req.body;
    const userDetails = await findOne("Users", { _id: userId });
    if (!userDetails)
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

    let gameType = "StarLine";
    let arrayFinal = await result(gameType);
    return SuccessResponse(res, HTTP_MESSAGE.ALL_GAME_LIST, arrayFinal);
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

const jackPotAllGames = async (req, res) => {
  try {
    const { userId } = req.body;
    const userDetails = await findOne("Users", { _id: userId });
    if (!userDetails)
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

    let gameType = "JackPot";
    let arrayFinal = await result(gameType);
    return SuccessResponse(res, HTTP_MESSAGE.ALL_GAME_LIST, arrayFinal);
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

const getNumber = async (req, res) => {
  try {
    const { userId } = req.body;
    const userDetails = await findOne("Users", { _id: userId });
    if (!userDetails)
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

    const info = await WalletContact.findOne(
      {},
      { number: 1, mobileNumber: 1 }
    );

    return SuccessResponse(res, HTTP_MESSAGE.GET_NUMBER_INFO, {
      details: info,
    });
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

const gameById = async (req, res) => {
  try {
    const { userId, gameType, gameId } = req.body;
    const userDetails = await findOne("Users", { _id: userId });
    if (!userDetails)
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

    const data = await GameSetting.findOne({ gameType, _id: gameId });

    return SuccessResponse(res, HTTP_MESSAGE.OPEN_GAME_RESULT, {
      details: data,
    });
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

const gamesRates = async (req, res) => {
  try {
    const { userId, gameType } = req.body;
    const userDetails = await findOne("Users", { _id: userId });
    if (!userDetails)
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

    const gameRates = await findAll("GameRate", { gameType });

    return SuccessResponse(res, HTTP_MESSAGE.GAME_RATES, {
      details: gameRates,
    });
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

const gamesRatesById = async (req, res) => {
  try {
    const { userId, gameType, gameRateId } = req.body;
    const userDetails = await findOne("Users", { _id: userId });
    if (!userDetails)
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

    const gameRates = await findAll("GameRate", { gameType, _id: gameRateId });
    return SuccessResponse(res, HTTP_MESSAGE.GAME_RATES, {
      details: gameRates,
    });
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

const cardList = async (req, res) => {
  try {
    const { userId, gameType } = req.body;
    const userDetails = await findOne("Users", { _id: userId });
    if (!userDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }
    const data = await Card.find(
      {
        status: true,
        [`cardInfo.${gameType}`]: true,
      },
      {
        cardName: 1,
        cardImage: 1,
      }
    );
    return SuccessResponse(res, HTTP_MESSAGE.CARD_LIST_SHOW_SUCCESSFULLY, {
      card: data,
    });
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

const addGameBids = async (req, res) => {
  try {
    // Destructuring request body
    const {
      userId,
      bidData: bidDatarray,
      bidSum: Balance,
      providerId,
      gameDate,
      gameSession,
      cardId,
      cardName,
      providerName,
      gameType,
    } = req.body;

    // Step 1: Validate User
    const user = await Users.findOne({ _id: userId });
    if (!user) {
      return res.status(200).send({ status: 0, message: "User Not Found" });
    }

    // Step 2: Validate Bid Time
    const bidTimeValidation = await validateBidTime(providerId, gameDate, gameSession);
    if (bidTimeValidation.status !== 1) {
      return res.status(200).send(bidTimeValidation);
    }

    // Step 3: Check Wallet Balance
    const walletBal = user.wallet_balance;
    if (walletBal < Balance) {
      return res.status(200).send({
        status: 2,
        message: "Insufficient Wallet Amount",
      });
    }

    // Step 4: Prepare Bid Data with additional fields like cardId, cardName, providerName
    const dt = dateTime.create();
    const currentDate = dt.format("d/m/Y");
    const bidsWithExtraInfo = bidDatarray.map(bid => ({
      ...bid,
      userId,
      cardId,
      cardName,
      providerId,
      providerName,
      gameDate,
      gameSession,
      gameType,
      bidTime: dt.format("H:M:S"),
    }));

    // Step 5: Place Bids
    const placedBids = await gameBid.insertMany(bidsWithExtraInfo);
    const updatedWallet = walletBal - Balance;

    // Step 6: Update Wallet Balance
    await Users.updateOne(
      { _id: userId },
      { $set: { wallet_balance: updatedWallet } }
    );

    // Step 7: Insert Bid History (assuming a helper function exists)
    await insertBidHistory(
      userId,
      user.userName,  // Assuming user's name is needed here
      placedBids,
      walletBal,
      currentDate,
      dt
    );

    // Step 8: Return Success Response
    return res.status(200).send({
      status: 200,
      message: "Bids Add Successfully",
      updatedWalletBal: updatedWallet,
    });

  } catch (error) {
    // Error Handling
    return res.status(400).json({
      status: 0,
      message: "Something Bad Happened. Contact Support",
      error,
    });
  }
};

export {
  allGames,
  starLineAllGames,
  jackPotAllGames,
  gameById,
  gamesRates,
  gamesRatesById,
  getNumber,
  cardList,
  addGameBids,
};
