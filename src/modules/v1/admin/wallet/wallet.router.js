import express from "express"
import {
  ValidationSource,
  validator,
} from "../../../../middlewares/validator.js";
import { roleList } from "../../../../consts/authorization.js";
const walletRouters = express.Router();
import { verifyToken } from "../../../../helpers/token.js";
import { verifyRoles } from "../../../../middlewares/verifyRoles.js";
import {approveCreditDebitRequest, updateWallet, walletHestory, walletHestoryCreditDebit } from "./wallet.controller.js";
// import {walletHestorySchema } from "./wallet.schema.js";

walletRouters.get(
  "/walletHestory",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  //validator(walletHestorySchema, ValidationSource.QUERY),
  walletHestory
);

// mastersRouters.post(
//   "/addUpi",
//   verifyToken,
//   verifyRoles(roleList.ADMIN),
//   validator(addUpiSchema, ValidationSource.BODY),
//   addUpi
// );

walletRouters.put(
  "/updateWallet",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  updateWallet
);

walletRouters.get(
  "/walletHestoryCreditDebit",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  walletHestoryCreditDebit
);

walletRouters.get(
  "/approveCreditDebitRequest",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  approveCreditDebitRequest
);

// mastersRouters.delete(
//   "/deleteUpi",
//   verifyToken,
//   verifyRoles(roleList.ADMIN),
//   validator(deleteUpiSchema, ValidationSource.BODY),
//   deleteUpi
// )

export { walletRouters };