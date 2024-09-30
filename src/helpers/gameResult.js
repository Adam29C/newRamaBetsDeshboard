import dateTime from "node-datetime";
import { GameProvider } from "../models/gameProvider.js";
import { GameSetting } from "../models/gameSetting.js";
import moment from "moment";

const result = async (type) => {
  const dt4 = dateTime.create();
  let dayName = dt4.format("W");

  const providers = await GameProvider.find(
    { activeStatus: true, gameType: type },
    { _id: 1, providerName: 1, providerResult: 1, resultStatus: 1 }
  );

  const ocTimes = await GameSetting.aggregate([
    { $unwind: "$gameSatingInfo" },
    {
      $match: {
        "gameSatingInfo.gameDay": dayName,
        gameType: type,
      },
    },
    {
      $project: {
        providerId: 1,
        gameDay: "$gameSatingInfo.gameDay",
        OBT: "$gameSatingInfo.OBT",
        CBT: "$gameSatingInfo.CBT",
        OBRT: "$gameSatingInfo.OBRT",
        CBRT: "$gameSatingInfo.CBRT",
        isClosed: "$gameSatingInfo.isClosed",
      },
    },
  ]);

  let arrayFinal = [];
  const dt3 = dateTime.create();
  let time = dt3.format("I:M p");
  const current = moment(time, "HH:mm a");

  for (const provider of providers) {
    const setting = ocTimes.find(
      (item) => item.providerId.toString() === provider._id.toString()
    );

    if (setting) {
      // Parse Open and Close times
      let OpenTime = setting.OBT;
      let CloseTime = setting.CBT;
      let isClosed = setting.isClosed;
      let startTime = moment(OpenTime, "HH:mm a");
      let endTime = moment(CloseTime, "HH:mm a");
      let appDisplayText = "Closed For Today";
      let colorCode = "#ff0000";

      if (!isClosed) {
        if (current.isBefore(startTime)) {
          appDisplayText = "Betting Is Running For open";
          colorCode = "#a4c639";
        } else if (current.isBefore(endTime)) {
          appDisplayText = "Betting Is Close For today";
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
        CloseBidTime: CloseTime,
      });
    } else {
      console.log(
        `No matching setting found for provider: ${provider.providerName}, providerId: ${provider._id}`
      );
    }
  }
  return arrayFinal;
};
export { result };
