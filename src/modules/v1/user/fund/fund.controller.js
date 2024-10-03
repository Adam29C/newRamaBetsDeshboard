import { findOne, insertQuery, update } from "../../../../helpers/crudMongo.js";
import moment from "moment";
import {
  BadRequestResponse,
  HTTP_MESSAGE,
  InternalServerErrorResponse,
  SuccessResponse,
} from "../../../../helpers/http.js";
import { bank } from "../../../../models/bank.js";
import { fundRequest } from "../../../../models/fundRequest.js";
import { GameSetting } from "../../../../models/gameSetting.js";
import { HowToPlay } from "../../../../models/howToPlay.js";
import { Users } from "../../../../models/users.js";
import { reqONoFF } from "../../../../models/requestOnOff.js";
//import { wallet } from "../../../../models/walledHistory.js";

const addFond = async (req, res) => {
  try {
    const { deviceId, userId, fullname, username, mobile, amount } = req.body;
    const userDetails = await findOne("Users", { _id: userId });
    if (!userDetails) return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FND);
    const fundInfo = {
      deviceId,
      userId,
      fullname,
      username,
      mobile,
      amount,
      reqType: "Credit",
      reqStatus: "Pending",
    };
    const data = await insertQuery("fundRequest", fundInfo);
    return SuccessResponse(res, HTTP_MESSAGE.ADD_FOUND, { details: data });
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

const fondHistory = async (req, res) => {
  try {
    const { userId } = req.body;
    const userDetails = await findOne("Users", { _id: userId });

    if (!userDetails) return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FND);
    const data = await findOne("fundRequest", { userId });
    let updatedAtDateObj = Date.now(data.updatedAt);

    let updatedDate = updatedAtDateObj.toLocaleString();

    console.log(updatedDate, "hhhhh");
    console.log(data, "data");
    return SuccessResponse(res, HTTP_MESSAGE.ADD_FOUND, { details: data });
  } catch (err) {
    console.log(err, "gggggggggg");
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

const userFundRequestList = async (req, res) => {
  try {
    const { userId } = req.body;
    const userDetails = await findOne("Users", { _id: userId });
    if (!userDetails) return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FND);
    const data = await findOne("fundRequest", { userId: userId });
    return SuccessResponse(res, HTTP_MESSAGE.OTP_SEND, { details: data });
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

const showUserWallet = async (req, res) => {
  try {
    const { userId } = req.body;

    const userDetails = await findOne(
      "Users",
      { _id: userId },
      { _id: 1, name: 1, mobile: 1, wallet_balance: 1 }
    );
    if (!userDetails) return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FND);

    return SuccessResponse(res, HTTP_MESSAGE.USER_WALLET, {
      details: userDetails,
    });
  } catch (err) {
    return BadRequestResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

const addBankDetails = async (req, res) => {
  try {
    const { userId, deviceId, accNumber, ifscCode, bankName, accName } =
      req.body;
    const userDetails = await findOne("Users", { deviceId: deviceId });
    console.log(userDetails, "ggggg");
    if (!userDetails) return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FND);
    const accObj = { userId, deviceId, accNumber, ifscCode, bankName, accName };
    const data = await insertQuery("bank", accObj);
    return SuccessResponse(res, HTTP_MESSAGE.USER_BANK_ADD, { details: data });
  } catch (err) {
    console.log(err);
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

const updateBankDetails = async (req, res) => {
  try {
    const { deviceId, accNumber, ifscCode, bankName, accName } = req.body;
    const userDetails = await findOne("Users", { deviceId: deviceId });
    if (!userDetails) return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FND);

    const updateObj = {};
    if (accNumber) updateObj.accNumber = accNumber;
    if (ifscCode) updateObj.ifscCode = ifscCode;
    if (bankName) updateObj.bankName = bankName;
    if (accName) updateObj.accName = accName;

    const bankDetails = await update("bank", { deviceId: deviceId }, updateObj);
    return SuccessResponse(res, HTTP_MESSAGE.USER_BANK_UPDATE, {
      details: bankDetails,
    });
  } catch (err) {
    console.log(err);
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

const changeBankDetailHistory = async (req, res) => {
  try {
    const { deviceId } = req.body;
    const userDetails = await findOne("Users", { deviceId });
    if (!userDetails) return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FND);

    const bankDetails = await findOne("bank", { deviceId });
    if (!bankDetails)
      return BadRequestResponse(res, HTTP_MESSAGE.BANK_DETAILS_NOT_FOUND);
    const { accNumber, ifscCode, bankName, accName, createdAt, updatedAt } =
      bankDetails;
    const updatedAtDateObj = new Date(updatedAt);

    const updatedAtDate = updatedAtDateObj.toLocaleDateString();
    const updatedAtTime = updatedAtDateObj.toLocaleTimeString();

    return SuccessResponse(res, HTTP_MESSAGE.USER_BANK_DETILS_HISTORY, {
      details: {
        accNumber,
        ifscCode,
        bankName,
        accName,
        createdAt,
        updatedAtDate,
        updatedAtTime,
      },
    });
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

const bankList = async (req, res) => {
  try {
    const { deviceId } = req.body;
    const userDetails = await findOne("Users", { deviceId: deviceId });
    if (!userDetails) return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FND);

    const data = await bank.aggregate([
      {
        $match: {
          deviceId,
        },
      },
      {
        $project: {
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
      },
    ]);
    return SuccessResponse(res, HTTP_MESSAGE.USER_BANK_ADD, { details: data });
  } catch (err) {
    console.log(err);
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

const withdrawFund = async (req, res) => {
  try {
    const {
      deviceId,
      accNumber,
      ifscCode,
      bankName,
      accName,
      user_id,
      req_amount,
      username,
      mobile,
      withdrawalMode,
    } = req.body;

    const userDetails = await findOne("Users", { deviceId });
    if (!userDetails) return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FND);

    const dt = moment();
    const dayName = dt.format("dddd");
    const checkDayoff = await reqONoFF.findOne({ dayName }, { enabled: 1 });

    console.log(checkDayoff, "bbbbbb");
    console.log(
      "this test file",
      "this is anather test file",
      "this is anather test file"
    );

    if (!checkDayoff || !checkDayoff.enabled) {
      return res.status(200).json({
        status: 0,
        message: checkDayoff
          ? checkDayoff.message
          : "Withdrawal requests are currently disabled.",
      });
    }

    // Check withdrawal time and limits
    const withdrawDetails = await reqONoFF.findOne(
      { isRequest: true },
      { startTime: 1, endTime: 1, requestCount: 1 }
    );
    console.log(withdrawDetails, "withdrawDetails");
    const currentTime = moment();
    const startMoment = moment(withdrawDetails.startTime, "HH:mm");
    const endMoment = moment(withdrawDetails.endTime, "HH:mm");

    if (!currentTime.isBetween(startMoment, endMoment, null, "[)")) {
      return res.status(400).json({
        status: 0,
        message: `Withdraw Time Over. Please Try ${withdrawDetails.startTime} To ${withdrawDetails.endTime}. Thank you`,
      });
    }

    const storedDate = moment(userDetails.withdrawalTime).startOf("day");
    const todayDate = moment().startOf("day");
    let count = userDetails.withdrawalCount || 0;

    if (storedDate.isSame(todayDate, "day")) {
      if (count >= withdrawDetails.requestCount) {
        return res.status(400).json({
          status: 0,
          message: "Your Withdraw Limit Is Over",
        });
      }
      count++;
    } else {
      count = 1;
    }

    // Check for pending requests
    const existingRequest = await fundReq.findOne({
      userId: user_id,
      reqStatus: "Pending",
      reqType: "Debit",
    });
    if (existingRequest) {
      return res.status(400).json({
        status: 0,
        message: "Your Previous Debit Request Is Pending",
      });
    }

    // Check last UPI request time if exists
    const lastUpi = await upi.findOne({ userId: user_id });
    if (lastUpi) {
      const lastRequestTime = moment(
        `${lastUpi.reqDate} ${lastUpi.reqTime}`,
        "DD/MM/YYYY HH:mm:ss A"
      );
      const timeDifference = moment
        .duration(moment().diff(lastRequestTime))
        .asMinutes();

      if (timeDifference < 5) {
        const waitTime = Math.ceil(5 - timeDifference); // Wait time in minutes
        return res.status(400).json({
          status: 5,
          message: `Please wait for ${waitTime} minute(s) to raise another withdraw request.`,
        });
      }
    }

    // Create and save new withdrawal request
    const formattedDate = dt.format("DD/MM/YYYY");
    const timestamp = dt.unix();

    console.log(formattedDate, "fff");
    const newFundReq = new fundReq({
      userId: user_id,
      reqAmount: req_amount,
      fullname: userDetails.name,
      username,
      mobile,
      reqType: "Debit",
      reqStatus: "Pending",
      toAccount: { accNumber, ifscCode, bankName, accName },
      reqDate: formattedDate,
      reqTime: currentTime.format("HH:mm"),
      withdrawalMode,
      UpdatedBy: "null",
      reqUpdatedAt: "null",
      timestamp,
    });

    await newFundReq.save();
    await User.findByIdAndUpdate(user_id, {
      withdrawalCount: count,
      withdrawalTime: currentTime.format(),
    });

    return res.status(200).json({
      status: 1,
      message: "Withdraw Request Raised Successfully",
    });
  } catch (error) {
    console.error("Withdraw Fund Error:", error);
    return res.status(500).json({
      status: 0,
      message: "Something went wrong. Please contact support.",
      error: error.toString(),
    });
  }
};

export {
  addFond,
  userFundRequestList,
  addBankDetails,
  bankList,
  updateBankDetails,
  withdrawFund,
  showUserWallet,
  changeBankDetailHistory,
  fondHistory,
};
