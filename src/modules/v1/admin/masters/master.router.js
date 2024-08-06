import express from "express"
import {
  ValidationSource,
  validator,
} from "../../../../middlewares/validator.js";
import { roleList } from "../../../../consts/authorization.js";
const mastersRouters = express.Router();
import { verifyToken } from "../../../../helpers/token.js";
import { verifyRoles } from "../../../../middlewares/verifyRoles.js";
import { addUpi, deleteUpi, updateUpiStatus, upiList } from "./masters.controller.js";
import { addUpiSchema, deleteUpiSchema, updateUpiStatusSchema, upiListSchema } from "./masters.schema.js";

mastersRouters.get(
  "/upiList",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(upiListSchema, ValidationSource.QUERY),
  upiList
);

mastersRouters.post(
  "/addUpi",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(addUpiSchema, ValidationSource.BODY),
  addUpi
);

mastersRouters.put(
  "/updateUpiStatus",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(updateUpiStatusSchema, ValidationSource.BODY),
  updateUpiStatus
);

mastersRouters.delete(
  "/deleteUpi",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(deleteUpiSchema, ValidationSource.BODY),
  deleteUpi
)
export { mastersRouters }; 