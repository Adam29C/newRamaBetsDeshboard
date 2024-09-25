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

// const games = async (req, res) => {
//   try {
//     const { userId, gameType } = req.body;
//     const userDetails = await findOne("Users", { _id: userId });
//     if (!userDetails)
//       return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

//     const openGamesresult = await GameSetting.aggregate([
//       { $match: { gameType } },
//       { $unwind: "$gameSatingInfo" },
//       { $match: { "gameSatingInfo.isClosed": false } },
//       {
//         $group: {
//           _id: "$_id",
//           gameType: { $first: "$gameType" },
//           providerName: { $first: "$providerName" },
//           providerId: { $first: "$providerId" },
//           gameSatingInfo: { $push: "$gameSatingInfo" },
//         },
//       },
//     ]);

//     return SuccessResponse(res, HTTP_MESSAGE.OPEN_GAME_RESULT, {
//       details: openGamesresult,
//     });
//   } catch (err) {
//     return InternalServerErrorResponse(
//       res,
//       HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
//       err
//     );
//   }
// };
const games = async (req, res) => {
	try {
		// Get the current day name using JavaScript's Date object
		const currentDate = new Date();
		const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		const dayName = dayNames[currentDate.getDay()]; // Get current day name

		// Fetch active game providers
		const providers = await gameProvider.find(
			{ activeStatus: true },
			{ _id: 1, providerName: 1, providerResult: 1, resultStatus: 1 }
		);

		// Fetch game open/close times for the current day
		const ocTimes = await gameOCtime.find(
			{ gameDay: dayName },
			{
				gameDay: 1,
				OBT: 1,  // Open Bid Time
				CBT: 1,  // Close Bid Time
				isClosed: 1,
				providerId: 1,
				OBRT: 1, // Open Bid Result Time
				CBRT: 1, // Close Bid Result Time
			}
		);

		// Initialize the final result object
		let resultData = {};

		// Populate the resultData object with providers' info
		providers.forEach((provider) => {
			resultData[provider._id] = {
				providerName: provider.providerName,
				providerResult: provider.providerResult,
				resultStatus: provider.resultStatus,
				OpenBidTime: "",
				CloseBidTime: "",
				OpenBidResultTime: "",
				CloseBidResultTime: "",
				isClosed: "",
				providerId: provider._id,
				gameDay: "",
				displayText: "",
				colorCode: "",
			};
		});

		// Update resultData with open/close times and status
		ocTimes.forEach((ocTime) => {
			const currentTime = moment(); // Current time as a moment object
			const OpenTime = moment(ocTime.OBT, "HH:mm a"); // Open Bid Time as moment object
			const CloseTime = moment(ocTime.CBT, "HH:mm a"); // Close Bid Time as moment object
			const isClosed = ocTime.isClosed;
			let displayText = "Closed For Today";
			let colorCode = "#ff0000"; // Default to red for closed

			// Compare current time with OpenTime and CloseTime
			if (isClosed === 1) {
				// If the game is still open
				if (currentTime.isBefore(OpenTime)) {
					displayText = "Running For Open";
					colorCode = "#a4c639"; // Green for open
				} else if (currentTime.isBefore(CloseTime)) {
					displayText = "Running For Close";
					colorCode = "#a4c639"; // Green for closing soon
				}
			}

			// Update the corresponding provider in resultData
			const providerId = ocTime.providerId;
			if (resultData[providerId]) {
				resultData[providerId] = {
					...resultData[providerId],
					OpenBidTime: ocTime.OBT,
					CloseBidTime: ocTime.CBT,
					OpenBidResultTime: ocTime.OBRT,
					CloseBidResultTime: ocTime.CBRT,
					isClosed: isClosed,
					gameDay: ocTime.gameDay,
					displayText: displayText,
					colorCode: colorCode,
				};
			}
		});

		// Respond with success and the result data
		res.status(200).json({
			status: 1,
			message: "Success",
			result: resultData,
		});
	} catch (error) {
		// Log the error for easier debugging
		console.error("Error in /games API:", error);

		// Respond with an error status
		res.status(400).json({
			status: 0,
			message: "Something went wrong",
			error: error.message, // Provide error message for more details
		});
	}
};

const gamesList = async (req, res) => {
  try {
    const { userId, gameType } = req.body;
    const userDetails = await findOne("Users", { _id: userId });
    if (!userDetails)
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

    const gamesList = await GameSetting.find({});
    const gamesList1 = await GameSetting.aggregate([
      { $match: { gameType: "MainGame" } },
      { $unwind: "$gameSatingInfo" },
      { $match: { "gameSatingInfo.isClosed": false } },
    ]);

    return SuccessResponse(res, HTTP_MESSAGE.OPEN_GAME_RESULT, {
      details: gamesList,
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
 
export { games, gameById, gamesRates, gamesRatesById, gamesList };
