import express from "express";
import { addBankDetails, addFund, bankDetailsHistory, bankList, changeBankDetailHistory, depositHistory, fundHistory, showUserWallet, termsAndCondition, updateBankDetails, userFundRequestList, withdrawFund, withdrawHistory } from "./fund.controller.js";
import { roleList } from "../../../../consts/authorization.js";
import { verifyRoles } from "../../../../middlewares/verifyRoles.js";
import { ValidationSource, validator } from "../../../../middlewares/validator.js";
import { verifyToken } from "../../../../helpers/token.js";
import {addBankSchema, addFundSchema, bankListSchema, fondHistorySchema, showUserWalletSchema, updateBankDetailsSchema, userFundRequestListSchema, withdrawFundSchema} from "../fund/fund.schema.js"
const fundRouter =express.Router();

fundRouter.post(
    "/addFund",
    verifyToken,
    //validator(addFundSchema,ValidationSource.BODY),
    addFund
);

fundRouter.put(
  "/addBank",
  //validator(addBankSchema,ValidationSource.BODY),
  addBankDetails
);

fundRouter.post(
  "/bankList",
  //validator(bankListSchema,ValidationSource.BODY),
  bankList
);

fundRouter.put(
  "/updateBankDetails",
  validator(updateBankDetailsSchema,ValidationSource.BODY),
  updateBankDetails
);

fundRouter.post(
  "/withdrawFund",
  //validator(withdrawFundSchema,ValidationSource.BODY),
  withdrawFund
);

fundRouter.get(
  "/showUserWallet",
  validator(showUserWalletSchema,ValidationSource.QUERY),
  showUserWallet
);

fundRouter.get(
  "/userFundRequestList",
  verifyToken,
  validator(userFundRequestListSchema,ValidationSource.QUERY),
  userFundRequestList
);

fundRouter.get(
  "/changeBankDetailHistory",
  validator(bankListSchema,ValidationSource.BODY),
  changeBankDetailHistory
);

fundRouter.post(
  "/fundHistory",
  validator(fondHistorySchema,ValidationSource.BODY),
  fundHistory
);

fundRouter.get(
  "/termsAndCondition",
  // validator(fondHistorySchema,ValidationSource.QUERY),
  termsAndCondition
);

fundRouter.get(
  "/bankDetailsHistory",
  // validator(fondHistorySchema,ValidationSource.QUERY),
  bankDetailsHistory
);

fundRouter.get(
  "/withdrawHistory",
  // validator(fondHistorySchema,ValidationSource.QUERY),
  withdrawHistory
);

fundRouter.get(
  "/depositHistory",
  // validator(fondHistorySchema,ValidationSource.QUERY),
  depositHistory
);

export {fundRouter}