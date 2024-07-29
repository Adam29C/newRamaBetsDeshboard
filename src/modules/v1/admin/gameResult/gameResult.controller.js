import { findOne, insertQuery, deleteQuery, update, findAll, findWithSort } from '../../../../helpers/crudMongo.js';
import { HTTP_MESSAGE, InternalServerErrorResponse, SuccessResponse, BadRequestResponse, NotFoundResponse } from '../../../../helpers/http.js';
import Admin from '../../../../models/admin.js';
import { GameRate } from '../../../../models/gameRates.js';
import {GameProvider}from '../../../../models/gameProvider.js'
import { GameSetting } from '../../../../models/gameSetting.js';
import { GameResult } from '../../../../models/GameResult.js';
import moment from 'moment';
import { gameDigit } from '../../../../models/digits.js';

// Function For Add Game Result
const addGameResult = async (req, res) => {
  try {
    const { providerId, session, resultDate, winningDigit } = req.body;

    // Check if the provider exists
    const providerDetails = await findOne("GameProvider", { _id: providerId });
    if (!providerDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.GAME_PROVIDER_NOT_FOUND);
    }

    // Get current time and day
    const currentTime = moment().format("h:mm A");
    const todayDay = moment().format("dddd");

    // Query GameSetting for today's session
    const findTime = await GameSetting.findOne(
      { providerId, "gameSatingInfo.gameDay": todayDay },
      { "gameSatingInfo.$": 1 }
    );

    if (!findTime || !findTime.gameSatingInfo[0]) {
      return BadRequestResponse(res, HTTP_MESSAGE.PROVIDER_SETTING_NOT_FOUND);
    }

    const timeCheck = session === "Close" ? findTime.gameSatingInfo[0].CBRT : findTime.gameSatingInfo[0].OBRT;

    // Parse and validate resultDate
    const resultDateParsed = moment(resultDate, "MM/DD/YYYY", true);
    if (!resultDateParsed.isValid()) {
      return BadRequestResponse(res, HTTP_MESSAGE.INVALID_RESULT_DATE);
    }

    // Check if it's the correct time to declare result
    const beginningTime = moment(currentTime, "h:mm A");
    const endTime = moment(timeCheck, "h:mm A");

    if (!resultDateParsed.isSame(moment(), "day")) {
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
    const digitFamily = await gameDigit.findOne({ Digit: winningDigit });
    console.log(digitFamily, "1", digitFamily.DigitFamily); // Note the case correction
    if (!digitFamily) {
      return BadRequestResponse(res, HTTP_MESSAGE.DIGIT_FAMILY_NOT_FOUND);
    }

    // Create formatted date-time and new game result object
    const formattedDateTime = new Date(); // Current date and time as Date object
    const newGameResult = {
      providerId,
      providerName: providerDetails.providerName,
      session,
      resultDate: resultDateParsed.toDate(),
      winningDigit,
      DigitFamily: digitFamily.DigitFamily, // Note the case correction
      status: "0",
      createdAt: formattedDateTime,
    };

    // Save the game result to database
    const savedGameResult = await insertQuery("GameResult", newGameResult);

    // Update provider with new result
    const finalResult = `${winningDigit}-${digitFamily.DigitFamily}`; // Note the case correction
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
      resultDate: moment(resultDateParsed).format("MM/DD/YYYY"),
      winningDigit,
      resultId: savedGameResult._id,
      status: savedGameResult.status,
      digitFamily: digitFamily.DigitFamily, // Note the case correction
      providerName: providerDetails.providerName,
      time: savedGameResult.createdAt,
    };

    // Send success response
    return SuccessResponse(res, HTTP_MESSAGE.RESULT_DECLARED_SUCCESSFULLY, rowData);

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

//Get The Game Result
const getGameResult = async (req, res) => {
  try {
    const { date } = req.query;
    //Fatch the record based on date
    const gameResult = await GameResult.find().where("resultDate").equals(date);
    
    // Count the number of game results for the given date
    const countResult = await GameResult.find({ resultDate: date }).countDocuments();

    // Count the number of providers and calculate pending count
    const providerCount = await GameProvider.find().countDocuments();
    const pendingCount = providerCount * 2 - countResult;

    const result = {
      gameResult: gameResult,
      countResult: countResult,
      providerCount: providerCount,
      pendingCount: pendingCount,
    };

    return SuccessResponse(res, HTTP_MESSAGE.GAME_RESULT_LIST_SHOW_SUCCESSFULLY, result);

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

export { addGameResult,getGameResult  };
