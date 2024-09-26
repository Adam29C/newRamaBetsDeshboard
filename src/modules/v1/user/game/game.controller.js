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
import  dateTime from "node-datetime";
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

// const allGames = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     const userDetails = await findOne("Users", { _id: userId });
//     if (!userDetails)
//       return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

//     const currentDate = new Date();
//     const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//     const dayName = dayNames[currentDate.getDay()]; // Get current day name
//     const currentTime = moment().format("HH:mm a");

//     // Aggregation pipeline
//     const result = await GameProvider.aggregate([
//       // Match active providers
//       {
//         $match: { activeStatus: true },
//       },
//       // Match only the documents where gameType is "mainGame"
//       {
//         $match: { gameType: "MainGame" }
//       },
//       // Lookup corresponding game settings (open/close times) for the current day
//       {
//         $lookup: {
//           from: "gamesettings", // The collection where game settings are stored
//           localField: "_id", // Field from GameProvider
//           foreignField: "providerId", // Field from GameSetting
//           as: "gameSettings", // Alias for matched results
//           pipeline: [
//             { $match: { gameDay: dayName,gameType: "MainGame" } }, // Filter game settings by the current day
//             {
//               $project: {
//                 OBT: 1,  // Open Bid Time
//                 CBT: 1,  // Close Bid Time
//                 OBRT: 1, // Open Bid Result Time
//                 CBRT: 1, // Close Bid Result Time
//                 isClosed: 1,
//                 gameDay: 1,
//               }
//             }
//           ]
//         }
//       },
//       // Unwind the gameSettings array (in case no settings exist for a provider, preserve the document)
//       {
//         $unwind: {
//           path: "$gameSettings",
//           preserveNullAndEmptyArrays: true,
//         }
//       },
//       // Add custom fields for display text and color code
//       {
//         $addFields: {
//           displayText: {
//             $cond: {
//               if: {
//                 $eq: ["$gameSettings.isClosed", 1], // If the game is closed
//               },
//               then: {
//                 $cond: [
//                   {
//                     $lt: [currentTime, "$gameSettings.OBT"], // If current time is before Open Bid Time
//                   },
//                   "Batting is running for today", // If the game is running for open
//                   {
//                     $cond: [
//                       {
//                         $lt: [currentTime, "$gameSettings.CBT"], // If current time is before Close Bid Time
//                       },
//                       "Batting is running for today", // If the game is running for close
//                       "Batting is close for today", // Otherwise, the game is closed for today
//                     ]
//                   }
//                 ]
//               },
//               else: "Batting is close for today", // If the game is not open, it's closed for today
//             }
//           },
//           colorCode: {
//             $cond: {
//               if: {
//                 $eq: ["$gameSettings.isClosed", 1], // If the game is closed
//               },
//               then: {
//                 $cond: [
//                   {
//                     $or: [
//                       { $lt: [currentTime, "$gameSettings.OBT"] }, // Before Open Time
//                       { $lt: [currentTime, "$gameSettings.CBT"] }, // Before Close Time
//                     ]
//                   },
//                   "#a4c639", // Green when open or closing soon
//                   "#ff0000", // Red when closed
//                 ]
//               },
//               else: "#ff0000", // Red for closed
//             }
//           }
//         }
//       },
//       // Project the final result fields
//       {
//         $project: {
//           _id: 1,
//           providerName: 1,
//           providerResult: 1,
//           resultStatus: 1,
//           "gameSettings.OBT": 1,
//           "gameSettings.CBT": 1,
//           "gameSettings.OBRT": 1,
//           "gameSettings.CBRT": 1,
//           "gameSettings.isClosed": 1,
//           "gameSettings.gameDay": 1,
//           displayText: 1,
//           colorCode: 1,
//         }
//       }
//     ]);
    

//     // Respond with success and the result data
//     return SuccessResponse(res, HTTP_MESSAGE.ALL_GAME_LIST, {
//       details: result,
//     });

//   } catch (err) {
//     return InternalServerErrorResponse(
//       res,
//       HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
//       err
//     );
//   }
// };

const allGames = async (req, res) => {
  try {
    const dt4 = dateTime.create();
    let dayName = dt4.format("W"); // Get the current week day name
    console.log(dayName, "gggg");

    // Use MongoDB aggregation to combine provider and game settings
    const providersWithSettings = await GameProvider.aggregate([
      {
        $match: { activeStatus: true } // Only active providers
      },
      {
        $lookup: {
          from: 'gamesettings', // Reference the GameSetting collection
          let: { providerId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$providerId', '$$providerId'] },
                    { $eq: ['$gameDay', dayName] }
                  ]
                }
              }
            }
          ],
          as: 'gameSettingInfo'
        }
      },
      {
        $unwind: { path: '$gameSettingInfo', preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          _id: 1,
          providerName: 1,
          providerResult: 1,
          resultStatus: 1,
          OpenBidTime: { $ifNull: ['$gameSettingInfo.OBT', ''] },
          CloseBidTime: { $ifNull: ['$gameSettingInfo.CBT', ''] },
          OpenBidResultTime: { $ifNull: ['$gameSettingInfo.OBRT', ''] },
          CloseBidResultTime: { $ifNull: ['$gameSettingInfo.CBRT', ''] },
          isClosed: { $ifNull: ['$gameSettingInfo.isClosed', false] },
          gameDay: { $ifNull: ['$gameSettingInfo.gameDay', ''] },
          providerId: '$_id'
        }
      }
    ]);

    console.log(providersWithSettings, "gg");

    // Prepare the final response array
    let arrayFinal = {};

    // Current time
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

      arrayFinal[providerItem.providerId] = {
        providerName: providerItem.providerName,
        providerResult: providerItem.providerResult,
        resultStatus: providerItem.resultStatus,
        OpenBidTime: providerItem.OpenBidTime,
        CloseBidTime: providerItem.CloseBidTime,
        OpenBidResultTime: providerItem.OpenBidResultTime,
        CloseBidResultTime: providerItem.CloseBidResultTime,
        isClosed: providerItem.isClosed,
        gameDay: providerItem.gameDay,
        displayText: appDisplayText,
        colorCode: colorCode,
        providerId: providerItem.providerId,
      };
    }

    res.status(200).json({
      status: 1,
      message: "Success",
      result: arrayFinal,
    });
  } catch (error) {
    console.log(error); // Log error for debugging
    res.status(400).json({
      status: 0,
      message: "Something Went Wrong",
      error: error,
    });
  }
};


// const starLineAllGames= async (req, res) => {
// 	try {
// 		const dt4 = dateTime.create();
// 		let dayName = dt4.format("W");
// 		const provider = await GameProvider.find(
// 			{},
// 			{ _id: 1, providerName: 1, providerResult: 1, resultStatus: 1 }
// 		);
// 		const ocTime = await GameSetting.find(
// 			{ gameDay: dayName },
// 			{ gameDay: 1, OBT: 1, CBT: 1, OBRT: 1, isClosed: 1, providerId: 1 }
// 		);

// 		const todayDate = dateTime.create();
// 		const date = todayDate.format("m/d/Y");

// 		let arrayFinal = {};
// 		for (index in provider) {
// 			arrayFinal[provider[index]._id] = {
// 				providerName: provider[index].providerName,
// 				providerResult: provider[index].providerResult,
// 				resultStatus: provider[index].resultStatus,
// 				OpenBidTime: "",
// 				CloseBidTime: "",
// 				isClosed: "",
// 				providerId: provider[index]._id,
// 				gameDay: "",
// 				displayText: "",
// 				colorCode: "",
// 				gameDate: date,
// 			};
// 		}
// 		for (index in ocTime) {
// 			const dt3 = dateTime.create();
// 			let time = dt3.format("I:M p");
// 			// let OpenTime = ocTime[index].OBT;
// 			let CloseTime = ocTime[index].CBT;
// 			let closed = ocTime[index].isClosed;
// 			let current = moment(time, "HH:mm a");
// 			// let startTime = moment(OpenTime, "HH:mm a");
// 			let endTime = moment(CloseTime, "HH:mm a");
// 			let appDisplayText = "Betting Is Closed For Today";
// 			let colorCode = "#ff0000";
// 			if (closed == 1) {
// 				if (current < endTime) {
// 					appDisplayText = "Betting Is Running Now";
// 					colorCode = "#a4c639";
// 				}
// 			} else {
// 				appDisplayText = "Betting Is Closed For Today";
// 				colorCode = "#ff0000";
// 			}
// 			let id = ocTime[index].providerId;
// 			if (arrayFinal[id]) {
// 				arrayFinal[id]["OpenBidTime"] = ocTime[index].OBT;
// 				arrayFinal[id]["CloseBidTime"] = ocTime[index].CBT;
// 				arrayFinal[id]["isClosed"] = ocTime[index].isClosed;
// 				arrayFinal[id]["gameDay"] = ocTime[index].gameDay;
// 				arrayFinal[id]["displayText"] = appDisplayText;
// 				arrayFinal[id]["colorCode"] = colorCode;
// 			}
// 		}
// 		res.status(200).json({
// 			status: 1,
// 			message: "Success",
// 			result: arrayFinal,
// 		});
// 	} catch (error) {
// 		res.status(400).json({
// 			status: 0,
// 			message: "Something Went Wrong",
// 			error: error,
// 		});
// 	}
// }

// const starLineAllGames = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     const userDetails = await findOne("Users", { _id: userId });
//     if (!userDetails)
//       return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

//     const currentDate = new Date();
//     const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//     const dayName = dayNames[currentDate.getDay()]; // Get current day name
//     console.log(dayName,"gggggg")
//     const currentTime = moment().format("HH:mm a");

//     // Aggregation pipeline
//     const result = await GameProvider.aggregate([
//       // Match active providers
//       {
//         $match: { activeStatus: true },
//       },
//       // Match only the documents where gameType is "StarLine"
//       {
//         $match: { gameType: "StarLine" }
//       },
//       // Lookup corresponding game settings (open/close times) for the current day
//       {
//         $lookup: {
//           from: "gamesettings", // The collection where game settings are stored
//           localField: "_id", // Field from GameProvider
//           foreignField: "providerId", // Field from GameSetting
//           as: "gameSettings", // Alias for matched results
//           pipeline: [
//             { $match: { gameDay: dayName } }, // Filter game settings by the current day and gameType "StarLine"
//             {
//               $project: {
//                 OBT: 1,  // Open Bid Time
//                 CBT: 1,  // Close Bid Time
//                 OBRT: 1, // Open Bid Result Time
//                 CBRT: 1, // Close Bid Result Time
//                 isClosed: 1,
//                 gameDay: 1,
//               }
//             }
//           ]
//         }
//       },
//       // Unwind the gameSettings array (in case no settings exist for a provider, preserve the document)
//       // {
//       //   $unwind: {
//       //     path: "$gameSettings",
//       //     preserveNullAndEmptyArrays: true,
//       //   }
//       // },
//       // // Add custom fields for display text and color code
//       // {
//       //   $addFields: {
//       //     displayText: {
//       //       $cond: {
//       //         if: {
//       //           $eq: ["$gameSettings.isClosed", 1], // If the game is closed
//       //         },
//       //         then: {
//       //           $cond: [
//       //             {
//       //               $lt: [currentTime, "$gameSettings.OBT"], // If current time is before Open Bid Time
//       //             },
//       //             "Batting is running for today", // If the game is running for open
//       //             {
//       //               $cond: [
//       //                 {
//       //                   $lt: [currentTime, "$gameSettings.CBT"], // If current time is before Close Bid Time
//       //                 },
//       //                 "Batting is running for today", // If the game is running for close
//       //                 "Batting is close for today", // Otherwise, the game is closed for today
//       //               ]
//       //             }
//       //           ]
//       //         },
//       //         else: "Batting is close for today", // If the game is not open, it's closed for today
//       //       }
//       //     },
//       //     colorCode: {
//       //       $cond: {
//       //         if: {
//       //           $eq: ["$gameSettings.isClosed", 1], // If the game is closed
//       //         },
//       //         then: {
//       //           $cond: [
//       //             {
//       //               $or: [
//       //                 { $lt: [currentTime, "$gameSettings.OBT"] }, // Before Open Time
//       //                 { $lt: [currentTime, "$gameSettings.CBT"] }, // Before Close Time
//       //               ]
//       //             },
//       //             "#a4c639", // Green when open or closing soon
//       //             "#ff0000", // Red when closed
//       //           ]
//       //         },
//       //         else: "#ff0000", // Red for closed
//       //       }
//       //     }
//       //   }
//       // },
//       // // Project the final result fields
//       // {
//       //   $project: {
//       //     _id: 1,
//       //     providerName: 1,
//       //     providerResult: 1,
//       //     resultStatus: 1,
//       //     "gameSettings.OBT": 1,
//       //     "gameSettings.CBT": 1,
//       //     "gameSettings.OBRT": 1,
//       //     "gameSettings.CBRT": 1,
//       //     "gameSettings.isClosed": 1,
//       //     "gameSettings.gameDay": 1,
//       //     displayText: 1,
//       //     colorCode: 1,
//       //   }
//       // }
//     ]);
    
//     // Respond with success and the result data
//     return SuccessResponse(res, HTTP_MESSAGE.ALL_GAME_LIST, {
//       details: result,
//     });

//   } catch (err) {
//     return InternalServerErrorResponse(
//       res,
//       HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
//       err
//     );
//   }
// };


const starLineAllGames = async (req, res) => {
    try {
        // Get the current day name
        const currentDate = new Date();
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayName = dayNames[currentDate.getDay()]; // Get current day name

        // Fetch providers from the database
        const provider = await GameProvider.find(
            { gameType: "StarLine" },
            { _id: 1, providerName: 1, providerResult: 1, resultStatus: 1 }
        );

        // Debugging: Log the providers fetched
        console.log("Providers fetched:", provider);

        // Fetch open and close times based on the current day
        const ocTime = await GameSetting.find(
            { gameDay: dayName, gameType: "StarLine" },
            { gameDay: 1, OBT: 1, CBT: 1, OBRT: 1, isClosed: 1, providerId: 1 }
        );

        // Debugging: Log the open/close times fetched
        console.log("Open/Close times fetched:", ocTime);

        // Get current date in MM/DD/YYYY format
        const date = moment().format("MM/DD/YYYY");

        let arrayFinal = {};
        for (const index in provider) {
            arrayFinal[provider[index]._id] = {
                providerName: provider[index].providerName, // This should have the correct provider name
                providerResult: provider[index].providerResult,
                resultStatus: provider[index].resultStatus,
                OpenBidTime: "",
                CloseBidTime: "",
                isClosed: "",
                providerId: provider[index]._id,
                gameDay: "",
                displayText: "",
                colorCode: "",
                gameDate: date,
            };
        }

        // Current time for comparison
        const currentTime = moment().format("HH:mm a");

        for (const index in ocTime) {
            let CloseTime = ocTime[index].CBT; // Close time from the database
            let closed = ocTime[index].isClosed; // Closed status from the database

            let current = moment(currentTime, "HH:mm a"); // Current time as a moment object
            let endTime = moment(CloseTime, "HH:mm a"); // Close time as a moment object

            let appDisplayText = "Betting Is Closed For Today";
            let colorCode = "#ff0000";

            // Determine display text and color code based on current time and closed status
            if (closed === 1 && current.isBefore(endTime)) {
                appDisplayText = "Betting Is Running Now";
                colorCode = "#a4c639";
            }

            let id = ocTime[index].providerId; // Get the provider ID
            if (arrayFinal[id]) {
                arrayFinal[id]["OpenBidTime"] = ocTime[index].OBT;
                arrayFinal[id]["CloseBidTime"] = CloseTime;
                arrayFinal[id]["isClosed"] = closed;
                arrayFinal[id]["gameDay"] = ocTime[index].gameDay;
                arrayFinal[id]["displayText"] = appDisplayText;
                arrayFinal[id]["colorCode"] = colorCode;
            }
        }

        res.status(200).json({
            status: 1,
            message: "Success",
            result: arrayFinal,
        });
    } catch (error) {
        console.error(error); // Log errors for debugging
        res.status(400).json({
            status: 0,
            message: "Something Went Wrong",
            error: error.toString(), // Return a string representation of the error
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
 
export { allGames,starLineAllGames, gameById, gamesRates, gamesRatesById, gamesList };
