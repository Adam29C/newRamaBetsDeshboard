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

const allGames = async (req, res) => {
  try {
    const { userId } = req.body;
    const userDetails = await findOne("Users", { _id: userId });
    if (!userDetails)
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

    const dt4 = dateTime.create();
    let dayName = dt4.format("W"); 

    const providersWithSettings = await GameProvider.aggregate([
      {
        $match: { activeStatus: true, gameType: "MainGame" }, // Only active providers
      },
      {
        $lookup: {
          from: "gamesettings", // Reference the GameSetting collection
          let: { providerId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$providerId", "$$providerId"] },
                    { $eq: ["$gameDay", dayName] },
                  ],
                },
              },
            },
          ],
          as: "gameSettingInfo",
        },
      },
      {
        $unwind: { path: "$gameSettingInfo", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          providerName: 1,
          providerResult: 1,
          resultStatus: 1,
          OpenBidTime: { $ifNull: ["$gameSettingInfo.OBT", ""] },
          CloseBidTime: { $ifNull: ["$gameSettingInfo.CBT", ""] },
          OpenBidResultTime: { $ifNull: ["$gameSettingInfo.OBRT", ""] },
          CloseBidResultTime: { $ifNull: ["$gameSettingInfo.CBRT", ""] },
          isClosed: { $ifNull: ["$gameSettingInfo.isClosed", false] },
          gameDay: { $ifNull: ["$gameSettingInfo.gameDay", ""] },
          providerId: "$_id",
        },
      },
    ]);

    let arrayFinal = [];
    const dt3 = dateTime.create();
    let time = dt3.format("I:M p"); // Get current time in HH:mm a format
    const current = moment(time, "HH:mm a");

    for (const providerItem of providersWithSettings) {
      let OpenTime = providerItem.OpenBidTime;
      let CloseTime = providerItem.CloseBidTime;
      let isClosed = providerItem.isClosed;
      let startTime = moment(OpenTime, "HH:mm a");
      let endTime = moment(CloseTime, "HH:mm a");
      let appDisplayText = "Closed For Today";
      let colorCode = "#ff0000";

      // Determine display text and color code based on current time and closed status
      if (isClosed) {
        if (startTime > current) {
          appDisplayText = "Running For Open";
          colorCode = "#a4c639";
        } else if (endTime > current) {
          appDisplayText = "Running For Close";
          colorCode = "#a4c639";
        }
      }

      arrayFinal.push({
        providerName: providerItem.providerName,
        providerResult: providerItem.providerResult,
        resultStatus: providerItem.resultStatus,
        isClosed: providerItem.isClosed,
        displayText: appDisplayText,
        colorCode: colorCode,
        providerId: providerItem.providerId,
      });
    }

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

    const currentDate = new Date();
    const dayNames = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    const dayName = dayNames[currentDate.getDay()]; // Get current day
    console.log("Current Day Name:", dayName); // Debugging: Log the current day name

    // Fetch game settings for StarLine game type
    const gameSettingInfo = await GameSetting.aggregate([
      {
        $match: {
          gameType: "StarLine",
        },
      },
      {
        $unwind: "$gameSatingInfo", // Unwind to access fields directly
      },
      {
        $project: {
          _id: 0,
          providerId: "$providerId",
          providerName: "$providerName",
          gameDay: "$gameSatingInfo.gameDay",
          OBT: "$gameSatingInfo.OBT",
          CBT: "$gameSatingInfo.CBT",
          OBRT: "$gameSatingInfo.OBRT",
          CBRT: "$gameSatingInfo.CBRT",
          isClosed: "$gameSatingInfo.isClosed",
        },
      },
    ]);

    const date = moment().format("MM/DD/YYYY");
    let arrayFinal = []; // Change to an array

    const currentTime = moment().format("HH:mm a");
    const current = moment(currentTime, "HH:mm a");

    for (const setting of gameSettingInfo) {
      const {
        providerId,
        providerName,
        OBT,
        CBT,
        isClosed,
      } = setting;

      const appDisplayText = isClosed ? "Betting Is Closed For Today" : "Betting Is Running Now";
      const colorCode = isClosed ? "#ff0000" : "#a4c639";

      // Push provider data directly as an object into arrayFinal
      arrayFinal.push({
        providerName,
        OpenBidTime: OBT,
        CloseBidTime: CBT,
        isClosed,
        providerId,
        displayText: appDisplayText,
        colorCode,
        gameDate: date,
      });
    }

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
    // Get the current day name
    const currentDate = new Date();
    const dayNames = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    const dayName = dayNames[currentDate.getDay()]; // Get current day
    console.log("Current Day Name:", dayName); // Debugging: Log the current day name

    // Fetch game settings for JackPot game type
    const gameSettingInfo = await GameSetting.aggregate([
      {
        $match: {
          gameType: "JackPot",
        },
      },
      {
        $unwind: "$gameSatingInfo", // Unwind to access fields directly
      },
      {
        $project: {
          _id: 0,
          providerId: "$providerId",
          providerName: "$providerName",
          gameDay: "$gameSatingInfo.gameDay",
          OBT: "$gameSatingInfo.OBT",
          CBT: "$gameSatingInfo.CBT",
          OBRT: "$gameSatingInfo.OBRT",
          CBRT: "$gameSatingInfo.CBRT",
          isClosed: "$gameSatingInfo.isClosed",
        },
      },
    ]);

    console.log("Game Setting Info:", gameSettingInfo); // Log the aggregation result

    // Prepare the final response array
    const date = moment().format("MM/DD/YYYY");
    const arrayFinal = []; // Initialize as an array

    // Current time for display
    const currentTime = moment().format("HH:mm a");
    const current = moment(currentTime, "HH:mm a");

    // Construct the final result array
    for (const setting of gameSettingInfo) {
      const {
        providerId,
        providerName,
        OBT,
        CBT,
        isClosed,
      } = setting;

      // Check the OpenBidTime and CloseBidTime values
      console.log(`Provider ID: ${providerId}, OpenBidTime: ${OBT}, CloseBidTime: ${CBT}`); // Debugging

      // Set display text and color code based on the current status
      const appDisplayText = isClosed ? "Betting Is Closed For Today" : "Betting Is Running Now";
      const colorCode = isClosed ? "#ff0000" : "#a4c639";

      // Push provider data into the arrayFinal
      arrayFinal.push({
        providerName,
        OpenBidTime: OBT,
        CloseBidTime: CBT,
        isClosed,
        providerId,
        displayText: appDisplayText,
        colorCode,
        gameDate: date,
      });
    }

    // Send the final response as an array
    return res.status(200).json({
      status: 200,
      success: true,
      data: arrayFinal, // Sending the array as is
      message: "ALL GAME RESULT SHOW SUCCESSFULLY",
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
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

export {
  allGames,
  starLineAllGames,
  jackPotAllGames,
  gameById,
  gamesRates,
  gamesRatesById,
  getNumber,
};
