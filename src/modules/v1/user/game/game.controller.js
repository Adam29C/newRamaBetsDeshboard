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
		// Get current day name using JavaScript's Date object
		const currentDate = new Date();
		const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		const dayName = dayNames[currentDate.getDay()]; // Get current day name

		// Get the current time in "HH:mm a" format
		const currentTime = moment().format("HH:mm a");

		// Aggregation pipeline
		const result = await GameProvider.aggregate([
			// Match active providers
			{
				$match: { activeStatus: true },
			},
			// Lookup corresponding game settings (open/close times) for the current day
			{
				$lookup: {
					from: "gamesettings", // The collection where game settings are stored
					localField: "_id", // Field from GameProvider
					foreignField: "providerId", // Field from GameSetting
					as: "gameSettings", // Alias for matched results
					pipeline: [
						{ $match: { gameDay: dayName } }, // Filter game settings by the current day
						{
							$project: {
								OBT: 1,  // Open Bid Time
								CBT: 1,  // Close Bid Time
								OBRT: 1, // Open Bid Result Time
								CBRT: 1, // Close Bid Result Time
								isClosed: 1,
								gameDay: 1,
							}
						}
					]
				}
			},
			// Unwind the gameSettings array (in case no settings exist for a provider, preserve the document)
			{
				$unwind: {
					path: "$gameSettings",
					preserveNullAndEmptyArrays: true,
				}
			},
			// Add custom fields for display text and color code
			{
				$addFields: {
					displayText: {
						$cond: {
							if: {
								$eq: ["$gameSettings.isClosed", 1], // If the game is closed
							},
							then: {
								$cond: [
									{
										$lt: [currentTime, "$gameSettings.OBT"], // If current time is before Open Bid Time
									},
									"Running For Open",
									{
										$cond: [
											{
												$lt: [currentTime, "$gameSettings.CBT"], // If current time is before Close Bid Time
											},
											"Running For Close",
											"Closed For Today",
										]
									}
								]
							},
							else: "Closed For Today",
						}
					},
					colorCode: {
						$cond: {
							if: {
								$eq: ["$gameSettings.isClosed", 1], // If the game is closed
							},
							then: {
								$cond: [
									{
										$or: [
											{ $lt: [currentTime, "$gameSettings.OBT"] }, // Before Open Time
											{ $lt: [currentTime, "$gameSettings.CBT"] }, // Before Close Time
										]
									},
									"#a4c639", // Green when open or closing soon
									"#ff0000", // Red when closed
								]
							},
							else: "#ff0000", // Red for closed
						}
					}
				}
			},
			// Project the final result fields
			{
				$project: {
					_id: 1,
					providerName: 1,
					providerResult: 1,
					resultStatus: 1,
					"gameSettings.OBT": 1,
					"gameSettings.CBT": 1,
					"gameSettings.OBRT": 1,
					"gameSettings.CBRT": 1,
					"gameSettings.isClosed": 1,
					"gameSettings.gameDay": 1,
					displayText: 1,
					colorCode: 1,
				}
			}
		]);

		// Respond with success and the result data
    return SuccessResponse(res, HTTP_MESSAGE.ALL_GAME_LIST, {
      details: gamesList,
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
