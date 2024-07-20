import { findOne, insertQuery, deleteQuery, update, findAll, findWithSort } from '../../../../helpers/crudMongo.js';
import { HTTP_MESSAGE, InternalServerErrorResponse, SuccessResponse, BadRequestResponse, NotFoundResponse } from '../../../../helpers/http.js';
import Admin from '../../../../models/admin.js';
import { GameRate } from '../../../../models/gameRates.js';
import {GameProvider}from '../../../../models/gameProvider.js'
import { GameSetting } from '../../../../models/gameSetting.js';
import { GameResult } from '../../../../models/GameResult.js';
import moment from 'moment';
import { gameDigit } from '../../../../models/digits.js';

//Function For Add Gmae Result
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
    console.log(findTime,"ggggg")

    if (!findTime || !findTime.gameSatingInfo[0]) {
      return BadRequestResponse(res, HTTP_MESSAGE.PROVIDER_SETTING_NOT_FOUND);
    }

    const timeCheck = session === "Close" ? findTime.gameSatingInfo[0].CBRT : findTime.gameSatingInfo[0].OBRT;
     console.log(timeCheck,"gggg")
    // Parse and validate resultDate
    const resultDateParsed = moment(resultDate, "MM/DD/YYYY", true);
    if (!resultDateParsed.isValid()) {
      return BadRequestResponse(res, HTTP_MESSAGE.INVALID_RESULT_DATE);
    }

    // Check if it's the correct time to declare result
    const beginningTime = moment(currentTime, "h:mm A");
    console.log(beginningTime,"uuuuuuuuu")
    const endTime = moment(timeCheck, "h:mm A");
    console.log(endTime,"ffffff")

    if (!resultDateParsed.isSame(moment(), "day")) {
      return BadRequestResponse(res, HTTP_MESSAGE.INVALID_RESULT_DATE);
    }
    console.log(beginningTime ,">=" ,endTime)
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
    if (!digitFamily) {
      return BadRequestResponse(res, HTTP_MESSAGE.DIGIT_FAMILY_NOT_FOUND);
    }

    // Create formatted date-time and new game result object
    const formattedDateTime = moment().format("MM/DD/YYYY H:mm:ss A");
    const newGameResult = {
      providerId,
      providerName: providerDetails.providerName,
      session,
      resultDate: resultDateParsed.toDate(),
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
      resultDate: moment(resultDateParsed).format("MM/DD/YYYY"),
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
    console.error("Error in addGameResult:", err.message);
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};



//Get The Game Result
const getGameResult = async (req, res) => {
  try {
    const { adminId } = req.query;

    const formatted = moment().format("MM/DD/YYYY");
    console.log(formatted,"fff")
    const chaeckInfo = await findOne("Admin", { _id: adminId });

    if (!chaeckInfo) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    // Fetch today's game results
    let result = await findWithSort("GameResult", { resultDate: formatted }, { _id: -1 });

    // If no results found for today, check previous day's results
    if (result.length === 0) {
      const currentTime = moment();
      const checkTime = moment("09:00 AM", "hh:mm A");
      const beginningTime = moment(currentTime, "hh:mm A");

      if (beginningTime.isBefore(checkTime)) {
        const previousDate = moment().subtract(1, 'days').startOf('day').toISOString();
        result = await findWithSort("GameResult", { resultDate: previousDate }, { _id: -1 });
      }
    }

    return SuccessResponse(res, HTTP_MESSAGE.GAME_RATE_LIST, result);

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

//Delete the game result
const deleteGameResult = async (req, res) => {
  try {
    const { adminId, gameResultId } = req.body; // Destructure adminId and gameResultId directly from req.body
    console.log(req.body); 

    // Find the admin details
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    // Find the game result to delete
    const gameResult = await findOne("GameResult", { _id: gameResultId });
    if (!gameResult) {
      return BadRequestResponse(res, HTTP_MESSAGE.GAME_RESULT_NOT_FOUND);
    }

    // Perform the deletion
    const deleteResult = await deleteQuery("GameResult", { _id: gameResultId });
    if (!deleteResult) {
      return InternalServerErrorResponse(res, HTTP_MESSAGE.DELETE_GAME_RESULT);
    }

    // If deletion is successful
    return SuccessResponse(res, HTTP_MESSAGE.DELETE_GAME_RESULT);
    
  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};


/*const test= async(req,res)=>{
  try{
    const {adminId}=req.body;
    console.log(req.body,"hhhh")
    const test=moment().change
  }catch(err){
  return InternalServerErrorResponce(res,HTTP_MESSAGE.InternalServerErrorResponce,err)
  }
  
  }
*/























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

export { addGameResult,getGameResult,deleteGameResult  };
