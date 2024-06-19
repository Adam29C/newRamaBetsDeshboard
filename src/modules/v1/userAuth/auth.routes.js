import { roleList } from "../../../consts/authorization.js";
import { verifyRoles } from "../../../middlewares/verifyRoles.js";
import { authMiddleware } from "./../../../middlewares/auth.js";
import { ValidationSource, validator } from "./../../../middlewares/validator.js";
import { resendOTP, userLogin, userLogout, verifyPhoneNumber } from "./auth.controller.js";
import { resendOtpSchema, userLogoutSchema } from './auth.schema.js';
import express from "express";

const authRouter = express.Router();
authRouter.post(
  "/login",
  authMiddleware,
  verifyRoles(roleList.USER),
  userLogin
);

authRouter.post(
  "/verify-user",
  authMiddleware,
  verifyRoles(roleList.USER),
  verifyPhoneNumber
);

authRouter.get(
  "/resend-otp/:userId",
  authMiddleware,
  validator(resendOtpSchema, ValidationSource.PARAM),
  verifyRoles(roleList.USER),
  resendOTP
);

authRouter.post(
  "/logout",
  authMiddleware,
  validator(userLogoutSchema, ValidationSource.BODY),
  verifyRoles(roleList.USER),
  userLogout
);

export { authRouter };
