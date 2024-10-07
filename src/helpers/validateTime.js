import moment from "moment";
import { GameSetting } from "../models/gameSetting.js";
import { checkBid } from "./checkBidInfo.js";

const validateBidTime = async (providerId, gameDate, gameSession) => {
	const dayName = moment(gameDate, "MM-DD-YYYY").format("dddd");
    console.log(dayName,"dayNamedayNamedayName")
	const gameSettingData = await GameSetting.aggregate([
        {
          $unwind: "$gameSatingInfo"
        },
        {
          $match: {
            gameType: "MainGame",
            "gameSatingInfo.gameDay": "Monday"
          }
        },
       {$project: {
         "gameSatingInfo.OBT":1,
         "gameSatingInfo.CBT":1,
         "gameSatingInfo.gameDay":1
        
      
      }}
      ])
	if (!gameSettingData) return { status: 2, message: "Invalid game day or provider." };

	const { OBT: openTime, CBT: closeTime, gameDay } = gameSettingData;
	const checkStatus = await checkBid(openTime, closeTime, gameSession, gameDay);
	
	return parseInt(checkStatus) === 1
		? { status: 1 }
		: { status: 2, message: "Bid time closed for the selected game." };
};
export {validateBidTime}