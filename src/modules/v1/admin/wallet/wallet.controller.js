import moment from "moment";
import {
  findAll,
  findOne,
  insertQuery,
  update,
} from "../../../../helpers/crudMongo.js";
import {
  BadRequestResponse,
  HTTP_MESSAGE,
  InternalServerErrorResponse,
  SuccessResponse,
} from "../../../../helpers/http.js";
import Admin from "../../../../models/admin.js";
import { UpiList } from "../../../../models/upiList.js";
import { Users } from "../../../../models/users.js";
import { fundRequest } from "../../../../models/fundRequest.js";
import { WalletHis } from "../../../../models/WalletHis1.js";

const walletHestory = async (req, res) => {
  try {
    const { adminId } = req.query;
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails)
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    let list = await findAll(
      "Users",
      {},
      { name: 1, mobile: 1, wallet_balance: 1, updatedAt: 1 }
    );
    const formatDate = (date) => {
      const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(
        date
      );
      const [datePart, timePart] = formattedDate.split(", ");
      return `${datePart}${timePart.replace(/\./g, "")}`;
    };

    list = list.map((user) => {
      return {
        ...user,
        updatedAt: user.updatedAt ? formatDate(new Date(user.updatedAt)) : null, // Convert to desired format
      };
    });
    return SuccessResponse(res, HTTP_MESSAGE.UPI_LIST_SHOW_SUCCESSFULLY, list);
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

const updateWallet = async (req, res) => {
  try {
    const { adminId, userId, amount, type, particular } = req.body;

    // Fetch admin details
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    // Fetch user details
    const userDetails = await Users.findOne({ _id: userId });
    if (!userDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FND);
    }

    // Calculate updated balance and prepare transaction details
    let update_bal, detail, reqType, filter;
    if (type === 1) {
      update_bal = userDetails.wallet_balance + parseInt(amount);
      detail = `Amount Added To Wallet By ${adminDetails.username}`;
      reqType = "Credit";
      filter = 4; // Credit filter type
    } else {
      update_bal = userDetails.wallet_balance - parseInt(amount);
      detail = `Amount Withdrawn From Wallet By ${adminDetails.username}`;
      reqType = "Debit";
      filter = 5; // Debit filter type
    }

    // Format date, time, and timestamp
    const formattedDate = moment().format("DD/MM/YYYY");
    const formattedTime = moment().format("hh:mm:ss A");
    const timestamp = moment(formattedDate, "DD/MM/YYYY").unix();

    // Create a new fund request
    const addReq = new fundRequest({
      userId,
      reqAmount: amount,
      fullname: userDetails.name,
      mobile: userDetails.mobile,
      reqType,
      reqStatus: "Approved",
      reqDate: formattedDate,
      reqTime: formattedTime,
      withdrawalMode: particular || "Bank", // Default to 'Bank' if not provided
      UpdatedBy: adminDetails.username,
      reqUpdatedAt: `${formattedDate} ${formattedTime}`,
      fromExport: false,
      from: 1,
      timestamp,
    });

    // Save the fund request
    const saveReq = await addReq.save();

    // Update user's wallet balance
    await Users.updateOne(
      { _id: userId },
      {
        $set: {
          wallet_balance: update_bal,
          wallet_bal_updated_at: `${formattedDate} ${formattedTime}`,
        },
      }
    );

    // Record the transaction in wallet history
    const history = new WalletHis({
      userId,
      bidId: saveReq._id,
      filterType: filter,
      previous_amount: userDetails.wallet_balance,
      current_amount: update_bal,
      transaction_amount: parseInt(amount),
      description: detail,
      transaction_date: formattedDate,
      transaction_time: formattedTime,
      transaction_status: "Success",
      adminId,
      particular: particular || "Bank",
      upiId: "null",
      timestamp,
      username: userDetails.name,
      reqType,
      addedBy_name: adminDetails.username,
      mobile: userDetails.mobile,
    });

    // Save wallet history
    await history.save();

    // (Optional) Send notification logic can go here

    // Respond with success and transaction details
    const data = update_bal;
    return SuccessResponse(res, HTTP_MESSAGE.WALLET_UPDATE_SUCCESSFULLY, data);
  } catch (err) {
    // Handle any errors
    console.error("Error in updateWallet:", err);
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

const walletHestoryCreditDebit = async (req, res) => {
  try {
    const { adminId, userId, type } = req.body;
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails)
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

    const userDetails = Users.findOne({ _id: userId });
    if (!userDetails) return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FND);

    const list = await fundRequest.find({ reqType: type });
    return SuccessResponse(res, HTTP_MESSAGE.WALLET_UPDATE_SUCCESSFULLY, list);
  } catch (err) {
    BadRequestResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

const fundHis = async (req, res) => {
  try {
    const { adminId, userId } = req.body;
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails)
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);

    const userDetails = Users.findOne({ _id: userId });
    if (!userDetails) return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FND);

    const list = await fundRequest.find({ reqType: type });
    return SuccessResponse(res, HTTP_MESSAGE.WALLET_UPDATE_SUCCESSFULLY, list);
  } catch (err) {
    BadRequestResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

export { walletHestory, updateWallet, walletHestoryCreditDebit };
