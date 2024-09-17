import express from "express";
import { games, getOtp,htp,setMpin,signup,updateMpin,userPrfile,varifiedOtp } from "./user.controller.js";
import { gamesSchema, getOtpSchema, htpSchema, setMpinSchema, signupSchema, userPrfileSchema, verifySchema } from "./user.schema.js";
import { roleList } from "../../../../consts/authorization.js";
import { verifyRoles } from "../../../../middlewares/verifyRoles.js";
import { ValidationSource, validator } from "../../../../middlewares/validator.js";
import { verifyToken } from "../../../../helpers/token.js";
const userLoginRouter =express.Router();

userLoginRouter.post(
    "/getOtp",
    validator(getOtpSchema,ValidationSource.BODY),
    getOtp
);

userLoginRouter.post(
  "/varifiedOtp",
  validator(verifySchema,ValidationSource.BODY),
  varifiedOtp
);

userLoginRouter.post(
  "/signup",
  validator(signupSchema,ValidationSource.BODY),
  signup
);

userLoginRouter.post(
  "/setMpin",
  validator(setMpinSchema,ValidationSource.BODY),
  setMpin
);

userLoginRouter.post(
  "/updateMpin",
  verifyToken,
  // validator(setMpinSchema,ValidationSource.BODY),
  updateMpin
);

userLoginRouter.get(
  "/userPrfile",
  verifyToken,
  validator(userPrfileSchema,ValidationSource.QUERY),
  userPrfile
);

userLoginRouter.get(
  "/htp",
  verifyToken,
  validator(htpSchema,ValidationSource.QUERY),
  htp
);

userLoginRouter.post(
  "/games",
  verifyToken,
  validator(gamesSchema,ValidationSource.BODY),
  games
);
export {userLoginRouter}