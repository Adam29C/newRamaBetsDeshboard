import { findOne, insertQuery, deleteQuery, update, findAll } from '../../../../helpers/crudMongo.js';
import { HTTP_MESSAGE, InternalServerErrorResponse, SuccessResponse, BadRequestResponse, NotFoundResponse } from '../../../../helpers/http.js';
import { gameDigit } from '../../../../models/digits.js';
import {GameProvider} from "../../../../models/gameProvider.js"

// router.post("/paymentRevert", session, async (req, res) => {
// 	try {
// 		const id = req.body.resultId;
// 		const provider = req.body.providerId;
// 		const session = req.body.session;
// 		const digit = req.body.digit;
// 		const digitFamily = req.body.family;
// 		const gameDate = req.body.date;
// 		const userInfo = req.session.details;
// 		const adminId = userInfo.user_id;
// 		const adminName = userInfo.username;
// 		let historyArray = [];
// 		let historyDataArray = [];
// 		const dt = dateTime.create();
// 		const formattedDate = dt.format("d/m/Y");
// 		const formattedTime = dt.format("I:M:S p");
// 		let updateResult = "***-**-***";
// 		let statusValue = 0;
// 		const winnerList = await gameBids
// 			.find({
// 				providerId: provider,
// 				gameDate: gameDate,
// 				gameSession: session,
// 				$and: [{ $or: [{ bidDigit: digit }, { bidDigit: digitFamily }] }],
// 			})
// 			.sort({ _id: -1, bidDigit: 1 });

// 		if (session === "Close") {
// 			const openResult = await gameResult.findOne({
// 				providerId: provider,
// 				resultDate: gameDate,
// 				session: "Open",
// 			});

// 			if (openResult) {
// 				const openFamily = openResult.winningDigitFamily;
// 				const openPana = openResult.winningDigit;
// 				updateResult = openPana + "-" + openFamily;
// 				jodiDigit = openFamily + digitFamily;
// 				halfSangam1 = openFamily + "-" + digit;
// 				halfSangam2 = openPana + "-" + digitFamily;
// 				fullSangam = openPana + "-" + digit;
// 				const winnerList = await gameBids
// 					.find({
// 						providerId: provider,
// 						gameDate: gameDate,
// 						gameSession: session,
// 						$and: [
// 							{
// 								$or: [
// 									{ bidDigit: jodiDigit },
// 									{ bidDigit: halfSangam1 },
// 									{ bidDigit: halfSangam2 },
// 									{ bidDigit: fullSangam },
// 								],
// 							},
// 						],
// 					})
// 					.sort({ bidDigit: 1 });

// 				for (index in winnerList) {
// 					let rowId = winnerList[index]._id;
// 					let userid = winnerList[index].userId;
// 					let winAmount = winnerList[index].gameWinPoints;
// 					let providerId = winnerList[index].providerId;
// 					let gameTypeid = winnerList[index].gameTypeId;
// 					let providerName = winnerList[index].providerName;
// 					let gameName = winnerList[index].gameTypeName;
// 					let username = winnerList[index].userName;
// 					let mobileNumber = winnerList[index].mobileNumber;

// 					let user = await mainUser.findOne(
// 						{ _id: userid },
// 						{ wallet_balance: 1 }
// 					);
// 					let walletBal = user.wallet_balance;
// 					revertBalance = walletBal - winAmount;

// 					let update = await mainUser.updateOne(
// 						{ _id: userid },
// 						{
// 							$set: {
// 								wallet_balance: revertBalance,
// 							},
// 						}
// 					);

// 					//history
// 					let arrValue = {
// 						userId: userid,
// 						bidId : rowId,
// 						filterType : 8,
// 						reqType : "main",
// 						previous_amount: walletBal,
// 						current_amount: revertBalance,
// 						transaction_amount: winAmount,
// 						provider_id: providerId,
// 						username: username,
// 						provider_ssession: session,
// 						description: "Amount Reverted",
// 						transaction_date: formattedDate,
// 						transaction_status: "Success",
// 						win_revert_status: 0,
// 						transaction_time: formattedTime,
// 						admin_id: adminId,
// 						addedBy_name: adminName,
// 					};

// 					historyDataArray.push(arrValue);

// 					arrValue = {
// 						userId: userid,
// 						providerId: providerId,
// 						gameTypeId: gameTypeid,
// 						providerName: providerName,
// 						username: username,
// 						mobileNumber: mobileNumber,
// 						gameTypeName: gameName,
// 						wallet_bal_before: walletBal,
// 						wallet_bal_after: revertBalance,
// 						revert_amount: winAmount,
// 						date: formattedDate,
// 						dateTime: formattedTime,
// 					};
// 					historyArray.push(arrValue);
// 				}
// 			}
// 			statusValue = 1;
// 		}

// 		if (Object.keys(winnerList).length > 0) {
// 			for (index in winnerList) {
// 				let rowId = winnerList[index]._id;
// 				let userid = winnerList[index].userId;
// 				let winAmount = winnerList[index].gameWinPoints;
// 				let providerId = winnerList[index].providerId;
// 				let gameTypeid = winnerList[index].gameTypeId;
// 				let providerName = winnerList[index].providerName;
// 				let gameName = winnerList[index].gameTypeName;
// 				let username = winnerList[index].userName;
// 				let mobileNumber = winnerList[index].mobileNumber;

// 				let user = await mainUser.findOne(
// 					{ _id: userid },
// 					{ wallet_balance: 1 }
// 				);
// 				let walletBal = user.wallet_balance;
// 				revertBalance = walletBal - winAmount;

// 				let update = await mainUser.updateOne(
// 					{ _id: userid },
// 					{
// 						$set: {
// 							wallet_balance: revertBalance,
// 						},
// 					}
// 				);

// 				//history
// 				let arrValue = {
// 					userId: userid,
// 					bidId : rowId,
// 					filterType : 3,
// 					reqType : "main",
// 					previous_amount: walletBal,
// 					current_amount: revertBalance,
// 					transaction_amount: winAmount,
// 					provider_id: providerId,
// 					username: username,
// 					provider_ssession: session,
// 					description: "Amount Reverted",
// 					transaction_date: formattedDate,
// 					transaction_status: "Success",
// 					win_revert_status: 0,
// 					transaction_time: formattedTime,
// 					admin_id: adminId,
// 					addedBy_name: adminName,
// 				};
// 				historyDataArray.push(arrValue);

// 				arrValue = {
// 					userId: userid,
// 					providerId: providerId,
// 					gameTypeId: gameTypeid,
// 					providerName: providerName,
// 					username: username,
// 					mobileNumber: mobileNumber,
// 					gameTypeName: gameName,
// 					wallet_bal_before: walletBal,
// 					wallet_bal_after: revertBalance,
// 					revert_amount: winAmount,
// 					date: formattedDate,
// 					dateTime: formattedTime,
// 				};

// 				historyArray.push(arrValue);
// 			}
// 		}

// 		await revertEntries.insertMany(historyArray);
// 		await history.insertMany(historyDataArray);

// 		const asbs = await gameBids.updateMany(
// 			{ providerId: provider, gameDate: gameDate, gameSession: session },
// 			{
// 				$set: {
// 					winStatus: 0,
// 					gameWinPoints: 0,
// 				},
// 			}
// 		);

// 		await gamesProvider.updateOne(
// 			{ _id: provider },
// 			{
// 				$set: {
// 					providerResult: updateResult,
// 					resultStatus: statusValue,
// 				},
// 			}
// 		);

// 		await gameResult.deleteOne({ _id: id });

// 		res.json({
// 			status: 1,
// 			message: "Reverted Successfully",
// 		});
// 	} catch (e) {
// 		res.json({
// 			status: 0,
// 			message: e,
// 		});
// 	}
// });


// Function for adding a game provider
const revertPayment = async (req, res) => {
  try {
    const { updateRevertPayment, deleteRevertPayment, revertPaymentList, revertPaymentById } = req.body;

    // Check if the admin exists
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails) return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    
    // Check if the admin exists
    const gameDetails = await findOne("GameResult", { _id: resultId });
    if (!gameDetails) return BadRequestResponse(res, HTTP_MESSAGE.GAME_RESULT_NOT_FOUND);
      
    // Check if the admin exists
    const providerDetails = await findOne("Admin", { _id: providerId });
    if (!providerDetails) return BadRequestResponse(res, HTTP_MESSAGE.PROVIDER_SETTING_NOT_FOUND);
    
    
    // Check if the admin exists
    const digitDetails = await findOne("gameDigit", { _id: adminId });
    if (!digitDetails) return BadRequestResponse(res, HTTP_MESSAGE.DIGIT_FAMILY_NOT_FOUND);
    console.log("testinggggggggggggggggggggggg")                        
    
    // // Prepare game provider details
    // const gameDetailsInfo = {
    //   gameType,
    //   game,
    //   providerName,
    //   providerResult,
    //   resultStatus,
    //   mobile,
    //   activeStatus
    // };

    // // Insert new game provider
    // const newGameProvider = await insertQuery("GameProvider", gameDetails);
    // return SuccessResponse(res, HTTP_MESSAGE.GAME_CREATED, { details: newGameProvider });

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

// // Function for Update a game provider
// const updateRevertPayment = async (req, res) => {
//   try {
//     const { adminId, gameProviderId, providerName, providerResult, resultStatus,activeStatus, mobile } = req.body;
    
//     // Check if the admin exists
//     const adminDetails = await findOne("Admin", { _id: adminId });
//     if (!adminDetails) {
//       return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
//     }

//     // Check if the game provider exists
//     const gameProviderDetails = await findOne("GameProvider", { _id: gameProviderId });
//     if (!gameProviderDetails) {
//       return NotFoundResponse(res, HTTP_MESSAGE.GAME_PROVIDER_NOT_FOUND);
//     }

//     //Update game provider object
//     const option = {};
//     if (providerName) {
//       option.providerName = providerName
//     };
//     if (providerResult) {
//       option.providerResult = providerResult
//     };
//     if (resultStatus) {
//       option.resultStatus = resultStatus
//     };
//     if (mobile) {
//       option.mobile = mobile
//     };
//     if (typeof activeStatus !== 'undefined') {
//       option.activeStatus = activeStatus;
//     };
  
//     //Return the responce 
//     const responce = await update("GameProvider", { _id: gameProviderId }, option, "findOneAndUpdate", option);
//     return SuccessResponse(res, HTTP_MESSAGE.GAME_PROVIDER_UPDATE, { details: responce })

//   } catch (err) {
//     console.log(err.message,"gggggggggggggggggggggggggggg")
//     return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
//   }
// };

// // Function for deleting a game provider
// const deleteRevertPayment = async (req, res) => {
//   try {
//     const { adminId, gameProviderId } = req.body;

//     // Check if the admin exists
//     const adminDetails = await findOne("Admin", { _id: adminId });
//     if (!adminDetails) {
//       return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
//     }

//     // Check if the game provider exists
//     const gameProviderDetails = await findOne("GameProvider", { _id: gameProviderId });
//     if (!gameProviderDetails) {
//       return NotFoundResponse(res, HTTP_MESSAGE.GAME_PROVIDER_NOT_FOUND);
//     }

//     // Delete the game provider
//     await deleteQuery("GameProvider", { _id: gameProviderId }, "deleteOne");
//     return SuccessResponse(res, HTTP_MESSAGE.GAME_PROVIDER_DELETED);

//   } catch (err) {
//     return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
//   }
// };

// // Function for all Provider game 
// const revertPaymentList = async (req, res) => {
//   try {
//     const {adminId} = req.query;

//     // Check if the admin exists
//     const adminDetails = await findOne("Admin", { _id: adminId });
//     if (!adminDetails) {
//       return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
//     }

//     //Prepaire the Responce for Game Provider List
//     const responce = await findAll("GameProvider", {});
//     return SuccessResponse(res, HTTP_MESSAGE.GAME_PROVIDER_DELETED, { details: responce });

//   } catch (err) {
//     return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
//   }
// };

// // Function for all Provider game 
// const revertPaymentById = async (req, res) => {
//   try {
//     const gameProviderId = req.params.providerId;

//     // Check if the game provider exists
//     const gameProviderDetails = await findOne("GameProvider", { _id: gameProviderId });
//     if (!gameProviderDetails) {
//       return NotFoundResponse(res, HTTP_MESSAGE.GAME_PROVIDER_NOT_FOUND);
//     }
    
//     //Prepaire the Responce for Game Provider Info
//     const responce = await findOne("GameProvider", { _id: gameProviderId });
//     return SuccessResponse(res, HTTP_MESSAGE.PROVIDER_INFO, { details: responce });

//   } catch (err) {
//     return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
//   }
// };

export { revertPayment };
//updateRevertPayment, deleteRevertPayment, revertPaymentList, revertPaymentById