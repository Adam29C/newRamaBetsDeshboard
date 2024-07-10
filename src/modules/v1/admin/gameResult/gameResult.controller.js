import { findOne, insertQuery, deleteQuery, update, findAll } from '../../../../helpers/crudMongo.js';
import { HTTP_MESSAGE, InternalServerErrorResponse, SuccessResponse, BadRequestResponse, NotFoundResponse } from '../../../../helpers/http.js';
import Admin from '../../../../models/admin.js';
import { GameRate } from '../../../../models/gameRates.js';
import {GameProvider}from '../../../../models/gameProvider.js'
import { GameSetting } from '../../../../models/gameSetting.js';
import { GameResult } from '../../../../models/GameResult.js';
import moment from 'moment';
import { gameDigit } from '../../../../models/digits.js';

const addGameResult = async (req, res) => {
  try {
    const { providerId, session, resultDate, winningDigit } = req.body;
    console.log("1", req.body);
    let a=await gameDigit.findOne({ Digit: 100 });
    console.log(a,"gggg")
    // Check if the provider exists
    const providerDetails = await findOne("GameProvider", { _id: providerId });
    if (!providerDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.GAME_PROVIDER_NOT_FOUND);
    }
    console.log("2");

    // Check current time and provider settings
    const currentTime = moment().format("h:mm A");
    const todayDay = moment().format("dddd"); // Get full day name
    console.log("3");

    let getItem = { OBRT: 1, gameDay: 1 };
    if (session === "Close") {
      getItem = { CBRT: 1, gameDay: 1 };
    }
    console.log("4");

    // Query GameSetting for today
    const findTime = await GameSetting.findOne({ providerId, gameDay: todayDay }, getItem);
    console.log("5");

    // Validate if findTime is null or undefined
    if (!findTime || (session === "Close" && !findTime.CBRT) || (!findTime.OBRT && session !== "Close")) {
      return BadRequestResponse(res, HTTP_MESSAGE.PROVIDER_SETTING_NOT_FOUND);
    }
    console.log("6");

    let timeCheck = session === "Close" ? findTime.CBRT : findTime.OBRT;
    console.log("7");
    console.log(resultDate, "ggggggggggggg");

    // Parse and validate resultDate
    const resultDateParsed = moment(resultDate, "MM/DD/YYYY", true); // Parsing with strict mode
    console.log(resultDateParsed, "gggg");
    if (!resultDateParsed.isValid()) {
      return BadRequestResponse(res, HTTP_MESSAGE.INVALID_RESULT_DATE);
    }
    console.log("8");
    console.log("hhh");

    // Check if it's the correct time to declare result
    const beginningTime = moment(currentTime, "h:mm A");
    const endTime = moment(timeCheck, "h:mm A");
    console.log("ttt");
    console.log((moment(), "day"), "zzzzz");
    if (!moment(resultDateParsed).isSame(moment(), "day")) {
      return BadRequestResponse(res, HTTP_MESSAGE.INVALID_RESULT_DATE);
    }
    if (!(beginningTime >= endTime)) {
      return BadRequestResponse(res, HTTP_MESSAGE.IT_IS_NOT_RIGTH_TIME_TO_DECLARE_RESULT);
    }

    // Check if the result already exists for this provider on the given date and session
    const exist = await findOne("GameResult", { providerId, resultDate: resultDateParsed.toDate(), session });
    if (exist) {
      const data = `Details Already Filled For : ${providerDetails.providerName}, Session : ${session}, Date: ${resultDate}`;
      return BadRequestResponse(res, HTTP_MESSAGE.RESULT_NOT_DECLLARED, data);
    }

    // Fetch digit family based on winning digit
    console.log(`Querying gameDigit collection for Digit: ${winningDigit}`);
    const digitFamily = await gameDigit.findOne({ Digit: winningDigit });
    console.log(digitFamily, "ggggggggggggggg");
    if (!digitFamily) {
      return BadRequestResponse(res, HTTP_MESSAGE.DIGIT_FAMILY_NOT_FOUND);
    }

    // Create formatted date-time
    const formattedDateTime = moment().format("MM/DD/YYYY H:mm:ss A");

    // Create new game result object
    const newGameResult = {
      providerId,
      providerName: providerDetails.providerName,
      session,
      resultDate: resultDateParsed.toDate(), // Convert moment object to Date
      winningDigit,
      winningDigitFamily: digitFamily.digitFamily,
      status: "0",
      createdAt: formattedDateTime,
    };

    // Save the game result to database
    const savedGameResult = await insertQuery("GameResult", newGameResult);

    // Update provider with new result
    const finalResult = `${winningDigit}-${digitFamily.digitFamily}`;
    const updateData = {
      providerResult: finalResult,
      modifiedAt: formattedDateTime,
      resultStatus: 1,
    };
    await update("GameProvider", { _id: providerId }, updateData);

    // Prepare response data
    const rowData = {
      providerId,
      session,
      resultDate: resultDateParsed.format("MM/DD/YYYY"),
      winningDigit,
      resultId: savedGameResult._id,
      status: savedGameResult.status,
      digitFamily: digitFamily.digitFamily,
      providerName: providerDetails.providerName,
      time: savedGameResult.createdAt,
    };

    // Send success response
    return SuccessResponse(res, HTTP_MESSAGE.RESULT_DECLARED_SUCCESSFULLY, rowData);

  } catch (err) {
    console.error("Error in addGameResult:", err);
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

























// // Function for updating a game rate
// const updateGameRate = async (req, res) => {
//   try {
//     const { adminId, gameRateId, gameName, gamePrice } = req.body;

//     // Check if the admin exists
//     const adminDetails = await findOne('Admin', { _id: adminId });
//     if (!adminDetails) {
//       return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
//     }

//     // Check if the game rate exists
//     const gameRateDetails = await findOne('GameRate', { _id: gameRateId });
//     if (!gameRateDetails) {
//       return NotFoundResponse(res, HTTP_MESSAGE.GAME_RATE_NOT_FOUND);
//     }

//     // Prepare fields to be updated
//     const updateFields = {};
//     if (gameName !== undefined) updateFields.gameName = gameName;
//     if (gamePrice !== undefined) updateFields.gamePrice = gamePrice;

//     // Perform the update
//     const updatedGameRate = await updateQuery('GameRate', { _id: gameRateId }, updateFields, { new: true });

//     return SuccessResponse(res, HTTP_MESSAGE.GAME_RATE_UPDATE, { details: updatedGameRate });

//   } catch (err) {
//     return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
//   }
// };

// // Function for deleting a game rate
// const deleteGameRate = async (req, res) => {
//   try {
//     const { adminId, gameRateId } = req.body;

//     // Check if the admin exists
//     const adminDetails = await findOne('Admin', { _id: adminId });
//     if (!adminDetails) {
//       return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
//     }

//     // Check if the game rate exists
//     const gameRateDetails = await findOne('GameRate', { _id: gameRateId });
//     if (!gameRateDetails) {
//       return NotFoundResponse(res, HTTP_MESSAGE.GAME_RATE_NOT_FOUND);
//     }

//     // Delete the game rate
//     await deleteQuery('GameRate', { _id: gameRateId });
//     return SuccessResponse(res, HTTP_MESSAGE.GAME_RATE_DELETED);

//   } catch (err) {
//     ;
//     return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
//   }
// };

// // Function for listing all game rates
// const gameRateList = async (req, res) => {
//   try {
//     const { adminId } = req.query;

//     // Check if the admin exists
//     const adminDetails = await findOne('Admin', { _id: adminId });
//     if (!adminDetails) {
//       return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
//     }

//     // Fetch all game rates
//     const gameRates = await findAll('GameRate', {});
//     return SuccessResponse(res, HTTP_MESSAGE.GAME_RATE_LIST, gameRates);

//   } catch (err) {
//     return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
//   }
// };

// // Function for retrieving game rate by ID
// const gameRateById = async (req, res) => {
//   try {
//     const { gameRateId } = req.params;

//     // Check if the game rate exists
//     const gameRateDetails = await findOne('GameRate', { _id: gameRateId });
//     if (!gameRateDetails) {
//       return NotFoundResponse(res, HTTP_MESSAGE.GAME_RATE_NOT_FOUND);
//     }

//     // Prepare the response for game rate info
//     return SuccessResponse(res, HTTP_MESSAGE.GAME_RATE_DETAILS, gameRateDetails);

//   } catch (err) {
//     return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
//   }
// };

export { addGameResult  };
