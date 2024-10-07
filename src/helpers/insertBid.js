import { WalletHis } from "../models/WalletHis1.js";

const insertBidHistory = (userId, userName, bidsArray, walletBal, currentDate, dt) => {
	let historyDataArray = [];
	let previousAmount = walletBal;
	
	bidsArray.forEach((bid) => {
		previousAmount = walletBal;
		walletBal -= bid.biddingPoints;
		const time = dt.format("I:M:S p");

		historyDataArray.push({
			userId: userId,
			bidId: bid._id,
			reqType: "main",
			previous_amount: previousAmount,
			current_amount: walletBal,
			transaction_amount: bid.biddingPoints,
			username: userName,
			filterType: 0,
			description: `${bid.providerName} (${bid.gameTypeName}, ${bid.gameSession}): ${bid.bidDigit}`,
			transaction_date: currentDate,
			transaction_time: time,
			transaction_status: "Success"
		});
	});

	return WalletHis.insertMany(historyDataArray);
};
export {insertBidHistory}