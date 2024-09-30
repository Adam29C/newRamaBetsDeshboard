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

    // Validate user
    const userDetails = await findOne("Users", { _id: userId });
    if (!userDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    // Get current day of the week
    const dt4 = dateTime.create();
    let dayName = dt4.format("W");  // Ensure that the format matches the data in the DB (e.g., "Monday", "Tuesday")

    // Fetch providers with active status and gameType: 'MainGame'
    const providers = await GameProvider.find(
      { activeStatus: true, gameType: "MainGame" },
      { _id: 1, providerName: 1, providerResult: 1, resultStatus: 1 }
    );

    console.log("Fetched providers:", providers);  // Ensure providers data is correctly fetched

    // Fetch game settings with GameSetting aggregation
    const ocTimes = await GameSetting.aggregate([
      { $unwind: "$gameSatingInfo" },
      { 
        $match: {
          "gameSatingInfo.gameDay": dayName,  // Match current day
          gameType: "MainGame"                // Ensure it matches the gameType
        }
      },
      {
        $project: {
          providerId: 1,
          gameDay: "$gameSatingInfo.gameDay",
          OBT: "$gameSatingInfo.OBT",
          CBT: "$gameSatingInfo.CBT",
          OBRT: "$gameSatingInfo.OBRT",
          CBRT: "$gameSatingInfo.CBRT",
          isClosed: "$gameSatingInfo.isClosed"
        }
      }
    ]);

    console.log("Fetched ocTimes:", ocTimes);  // Ensure ocTimes data is correctly fetched

    let arrayFinal = [];
    const dt3 = dateTime.create();
    let time = dt3.format("I:M p"); 
    const current = moment(time, "HH:mm a");  // Convert to Moment.js time format

    // Combine provider data with the game settings (ocTimes)
    for (const provider of providers) {
      // Convert both provider._id and ocTimes.providerId to strings to match properly
      const setting = ocTimes.find(item => item.providerId.toString() === provider._id.toString());

      if (setting) {
        // Parse Open and Close times
        let OpenTime = setting.OBT;
        let CloseTime = setting.CBT;
        let isClosed = setting.isClosed;
        let startTime = moment(OpenTime, "HH:mm a");
        let endTime = moment(CloseTime, "HH:mm a");
        let appDisplayText = "Closed For Today";
        let colorCode = "#ff0000"; // Red if closed

        if (!isClosed) {
          if (current.isBefore(startTime)) {
            appDisplayText = "Running For Open";
            colorCode = "#a4c639"; 
          } else if (current.isBefore(endTime)) {
            appDisplayText = "Running For Close";
            colorCode = "#a4c639"; 
          }
        }

        arrayFinal.push({
          providerName: provider.providerName,
          providerResult: provider.providerResult,
          resultStatus: provider.resultStatus,
          isClosed: isClosed,
          displayText: appDisplayText,
          colorCode: colorCode,
          providerId: provider._id,
          OpenBidTime: OpenTime,  
          CloseBidTime: CloseTime 
        });
      } else {
        // Log when no matching setting is found for the provider
        console.log(`No matching setting found for provider: ${provider.providerName}, providerId: ${provider._id}`);
      }
    }

    // Return success response with the final array
    return SuccessResponse(res, HTTP_MESSAGE.ALL_GAME_LIST, arrayFinal);

  } catch (err) {
    // Log error for debugging
    console.error("Error:", err);
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

const starLineAllGames = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate user
    const userDetails = await findOne("Users", { _id: userId });
    if (!userDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    // Get current day of the week
    const dt4 = dateTime.create();
    let dayName = dt4.format("W");  // Ensure that the format matches the data in the DB (e.g., "Monday", "Tuesday")

    // Fetch providers with active status and gameType: 'MainGame'
    const providers = await GameProvider.find(
      { activeStatus: true, gameType: "StarLine" },
      { _id: 1, providerName: 1, providerResult: 1, resultStatus: 1 }
    );

    console.log("Fetched providers:", providers);  // Ensure providers data is correctly fetched

    // Fetch game settings with GameSetting aggregation
    const ocTimes = await GameSetting.aggregate([
      { $unwind: "$gameSatingInfo" },
      { 
        $match: {
          "gameSatingInfo.gameDay": dayName,  // Match current day
          gameType: "StarLine"                // Ensure it matches the gameType
        }
      },
      {
        $project: {
          providerId: 1,
          gameDay: "$gameSatingInfo.gameDay",
          OBT: "$gameSatingInfo.OBT",
          CBT: "$gameSatingInfo.CBT",
          OBRT: "$gameSatingInfo.OBRT",
          CBRT: "$gameSatingInfo.CBRT",
          isClosed: "$gameSatingInfo.isClosed"
        }
      }
    ]);

    console.log("Fetched ocTimes:", ocTimes);  // Ensure ocTimes data is correctly fetched

    let arrayFinal = [];
    const dt3 = dateTime.create();
    let time = dt3.format("I:M p"); 
    const current = moment(time, "HH:mm a");  // Convert to Moment.js time format

    // Combine provider data with the game settings (ocTimes)
    for (const provider of providers) {
      // Convert both provider._id and ocTimes.providerId to strings to match properly
      const setting = ocTimes.find(item => item.providerId.toString() === provider._id.toString());

      if (setting) {
        // Parse Open and Close times
        let OpenTime = setting.OBT;
        let CloseTime = setting.CBT;
        let isClosed = setting.isClosed;
        let startTime = moment(OpenTime, "HH:mm a");
        let endTime = moment(CloseTime, "HH:mm a");
        let appDisplayText = "Closed For Today";
        let colorCode = "#ff0000"; // Red if closed

        if (!isClosed) {
          if (current.isBefore(startTime)) {
            appDisplayText = "Running For Open";
            colorCode = "#a4c639"; 
          } else if (current.isBefore(endTime)) {
            appDisplayText = "Running For Close";
            colorCode = "#a4c639"; 
          }
        }

        arrayFinal.push({
          providerName: provider.providerName,
          providerResult: provider.providerResult,
          resultStatus: provider.resultStatus,
          isClosed: isClosed,
          displayText: appDisplayText,
          colorCode: colorCode,
          providerId: provider._id,
          OpenBidTime: OpenTime,  
          CloseBidTime: CloseTime 
        });
      } else {
        // Log when no matching setting is found for the provider
        console.log(`No matching setting found for provider: ${provider.providerName}, providerId: ${provider._id}`);
      }
    }

    // Return success response with the final array
    return SuccessResponse(res, HTTP_MESSAGE.ALL_GAME_LIST, arrayFinal);

  } catch (err) {
    // Log error for debugging
    console.error("Error:", err);
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

const jackPotAllGames = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate user
    const userDetails = await findOne("Users", { _id: userId });
    if (!userDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    // Get current day of the week
    const dt4 = dateTime.create();
    let dayName = dt4.format("W");  // Ensure that the format matches the data in the DB (e.g., "Monday", "Tuesday")

    // Fetch providers with active status and gameType: 'MainGame'
    const providers = await GameProvider.find(
      { activeStatus: true, gameType: "JackPot" },
      { _id: 1, providerName: 1, providerResult: 1, resultStatus: 1 }
    );

    console.log("Fetched providers:", providers);  // Ensure providers data is correctly fetched

    // Fetch game settings with GameSetting aggregation
    const ocTimes = await GameSetting.aggregate([
      { $unwind: "$gameSatingInfo" },
      { 
        $match: {
          "gameSatingInfo.gameDay": dayName,  // Match current day
          gameType: "JackPot"                // Ensure it matches the gameType
        }
      },
      {
        $project: {
          providerId: 1,
          gameDay: "$gameSatingInfo.gameDay",
          OBT: "$gameSatingInfo.OBT",
          CBT: "$gameSatingInfo.CBT",
          OBRT: "$gameSatingInfo.OBRT",
          CBRT: "$gameSatingInfo.CBRT",
          isClosed: "$gameSatingInfo.isClosed"
        }
      }
    ]);

    console.log("Fetched ocTimes:", ocTimes);  // Ensure ocTimes data is correctly fetched

    let arrayFinal = [];
    const dt3 = dateTime.create();
    let time = dt3.format("I:M p"); 
    const current = moment(time, "HH:mm a");  // Convert to Moment.js time format

    // Combine provider data with the game settings (ocTimes)
    for (const provider of providers) {
      // Convert both provider._id and ocTimes.providerId to strings to match properly
      const setting = ocTimes.find(item => item.providerId.toString() === provider._id.toString());

      if (setting) {
        // Parse Open and Close times
        let OpenTime = setting.OBT;
        let CloseTime = setting.CBT;
        let isClosed = setting.isClosed;
        let startTime = moment(OpenTime, "HH:mm a");
        let endTime = moment(CloseTime, "HH:mm a");
        let appDisplayText = "Closed For Today";
        let colorCode = "#ff0000"; // Red if closed

        if (!isClosed) {
          if (current.isBefore(startTime)) {
            appDisplayText = "Running For Open";
            colorCode = "#a4c639"; 
          } else if (current.isBefore(endTime)) {
            appDisplayText = "Running For Close";
            colorCode = "#a4c639"; 
          }
        }

        arrayFinal.push({
          providerName: provider.providerName,
          providerResult: provider.providerResult,
          resultStatus: provider.resultStatus,
          isClosed: isClosed,
          displayText: appDisplayText,
          colorCode: colorCode,
          providerId: provider._id,
          OpenBidTime: OpenTime,  
          CloseBidTime: CloseTime 
        });
      } else {
        console.log(`No matching setting found for provider: ${provider.providerName}, providerId: ${provider._id}`);
      }
    }
    return SuccessResponse(res, HTTP_MESSAGE.ALL_GAME_LIST, arrayFinal);
  } catch (err) {
    console.error("Error:", err);
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
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
