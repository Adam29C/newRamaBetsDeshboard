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
import  dateTime from "node-datetime";
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
    const dt = dateTime.create();
    const formatted = dt.format("d/m/Y I:m:S p");
    const { userId, deviceId, accNumber, ifscCode, bankName, accName } = req.body;

    // Find user by deviceId
    const userDetails = await findOne("Users", { deviceId });
    if (!userDetails) return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FND);

    // Check for existing bank profile
    const findBank = await bank.findOne({ userId });
    const username = userDetails.username || "Unknown User"; // Fallback if username not found

    if (!findBank) {
      // Create new bank details if findBank doesn't exist
      const bankDetails = new bank({
        userId,
        address: null,
        city: null,
        pincode: null,
        username,
        accNumber,  // Updated to match the field in your schema
        bankName,   // Updated to match the field in your schema
        ifscCode,   // Updated to match the field in your schema
        accName,    // Updated to match the field in your schema
        paytm_number: null,
        profileChangeCounter: 0,
        created_at: formatted,
      });

      const savedUser = await bankDetails.save();

      return SuccessResponse(res, HTTP_MESSAGE.USER_BANK_ADD, {
        details: savedUser,
      });
    } else {
      // Update existing bank details
      let changeDetails = findBank.changeDetails || [];
      let counter = findBank.profileChangeCounter;

      // Check if the new details are different from the existing ones
      const isDifferent =
        findBank.accNumber !== accNumber ||
        findBank.ifscCode !== ifscCode ||
        findBank.bankName !== bankName ||
        findBank.accName !== accName;

      if (isDifferent) {
        // Store old details for change history
        changeDetails.push({
          oldAccNumber: accNumber,  // Updated to match the field in your schema
          oldBankName: bankName, // Updated to match the field in your schema
          oldIfscCode: ifscCode,      // Updated to match the field in your schema
          oldAccName: accName,    // Updated to match the field in your schema
          oldPaytmNo: null,
          changeDate: formatted,
        });
        counter++;
      }

      await bank.updateOne(
        { userId },
        {
          $set: {
            accNumber, // Updated to match the field in your schema
            bankName,  // Updated to match the field in your schema
            ifscCode,  // Updated to match the field in your schema
            accName,   // Updated to match the field in your schema
            changeDetails,
            profileChangeCounter: counter,
            updatedAt: formatted,
          },
        }
      );

      return SuccessResponse(res, HTTP_MESSAGE.USER_BANK_UPDATED, {
        details: findBank,
      });
    }
  } catch (err) {
    console.error(err);
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
    const { deviceId, userId, reqAmount } = req.body;

    const userDetails = await findOne("Users", { deviceId });
    if (!userDetails) return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FND);

    const dt = moment();
    const dayName = dt.format("dddd");
    const checkDayoff = await reqONoFF.findOne({ dayName }, { enabled: 1 });

    if (!checkDayoff || !checkDayoff.enabled) {
      return res.json({
        status: false,
        statusCode: 400,
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

    const currentTime = moment();
    const startMoment = moment(withdrawDetails.startTime, "HH:mm");
    const endMoment = moment(withdrawDetails.endTime, "HH:mm");

    if (!currentTime.isBetween(startMoment, endMoment, null, "[)")) {
      return res.json({
        status: 400,
        success: false,
        message: `Withdraw time over. Please try ${withdrawDetails.startTime} to ${withdrawDetails.endTime}. Thank you.`,
      });
    }

    const storedDate = moment(userDetails.withdrawalTime).startOf("day");
    const todayDate = moment().startOf("day");
    let count = userDetails.withdrawalCount || 0;

    if (storedDate.isSame(todayDate, "day")) {
      if (count >= withdrawDetails.requestCount) {
        return BadRequestResponse(
          res,
          HTTP_MESSAGE.YOUR_WITHDRAWAL_LIMIT_IS_OVER
        );
      }
      count++;
    } else {
      count = 1;
    }

    const bankInfo = await bank.findOne({ userId });
    
    // Check for pending requests
    const existingRequest = await fundRequest.findOne({
      userId: userId,
      reqStatus: "Pending",
      reqType: "Debit",
    });

    if (existingRequest) {
      return BadRequestResponse(
        res,
        HTTP_MESSAGE.YOUR_PREVIOUS_DEBIT_REQUEST_IS_PENDING
      );
    }

    // Check wallet balance
    if (userDetails.wallet_balance < reqAmount) {
      return BadRequestResponse(res, HTTP_MESSAGE.INSUFFICIENT_BALANCE);
    }

    // Create and save new withdrawal request
    const formattedDate = dt.format("DD/MM/YYYY");
    const newFundReq = new fundRequest({
      userId: userId,
      reqAmount: reqAmount,
      fullname: userDetails.name,
      username: userDetails.username,
      mobile: userDetails.mobile,
      reqType: "Debit",
      reqStatus: "Pending",
      toAccount: {
        accNumber: bankInfo.accNumber,
        ifscCode: bankInfo.ifscCode,
        bankName: bankInfo.bankName,
        accName: bankInfo.accName,
      },
      reqDate: formattedDate,
      reqTime: currentTime.format("HH:mm"),
    });

    await newFundReq.save();
    await Users.findByIdAndUpdate(userId, {
      withdrawalCount: count,
      withdrawalTime: currentTime.format(),
    });

    return SuccessResponse(res, HTTP_MESSAGE.WITHDRAW_REQUEST_SUCCESS);
  } catch (error) {
    console.log(error,"gggg")
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
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
