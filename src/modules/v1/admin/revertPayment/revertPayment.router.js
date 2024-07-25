import express from "express";
import {
  ValidationSource,
  validator,
} from "../../../../middlewares/validator.js";
import { verifyToken } from "../../../../helpers/token.js";
import { roleList } from "../../../../consts/authorization.js";
import { verifyRoles } from "../../../../middlewares/verifyRoles.js";

import { revertPayment } from "./revertPayment.controller.js";
import { revertPaymentSchema } from "./revertPayment.schema.js";
const resultRevertPaymentRouter = express.Router();


resultRevertPaymentRouter.post(
  "/revertPayment",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(revertPaymentSchema, ValidationSource.BODY),
  revertPayment,
);


// gameDetailsRouters.delete(
//   "/gameProvider",
//   verifyToken,
//   verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
//   validator(deleteGameProviderSchema, ValidationSource.BODY),
//   deleteGameProvider,
// );

// gameDetailsRouters.put(
//   "/gameProvider",
//   verifyToken,
//   verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
//   validator(updateGameProviderSchema, ValidationSource.BODY),
//   updateGameProvider,
// );

// gameDetailsRouters.get(
//   "/gameProvider",
//   verifyToken,
//   verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
//   validator(gameProviderListSchema, ValidationSource.QUERY),
//   gameProviderList,
// );

// gameDetailsRouters.get(
//   "/gameProvider/:providerId",
//   verifyToken,
//   verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
//   validator(gameProviderIdSchema, ValidationSource.PARAM),
//   gameProviderById,
// );

export { resultRevertPaymentRouter }; 