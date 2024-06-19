import { deleteQuery, findOne, insertQuery, update } from "../../../helpers/crudMongo.js";
import { generateServerToken } from "../../../helpers/auth.js";
import { roleList } from "../../../consts/authorization.js";
import { BadRequestResponse, HTTP_MESSAGE, InternalServerErrorResponse, SuccessResponse } from "../../../helpers/http.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../../../config/env.config.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
// import { sendNotification } from "../notification/notification.controller.js";

const userLogin = async (req, res) => {
  try {
    const role = req?.roles?.[0];
    console.log("1");
    const { number, countryCode, fcmToken } = req.body;
    if (!number) {
      return BadRequestResponse(res, req.t("failure_message_1"));
    }
    console.log("2")
    let userDetails = await findOne("users", { "mobileNumber.value": number });
    if (userDetails) {
      if (userDetails.status == "deactived") {
        return BadRequestResponse(res, req.t("failure_message_50"));
      }
      console.log("3")
      await update(
        "users",
        { _id: userDetails._id },
        {
          "mobileNumber.otp": 1234,
          fcmToken: fcmToken,
        }
      );
    } else {
      let data = {
        "mobileNumber.value": number,
        "mobileNumber.verified": false,
        "mobileNumber.otp": 1234,
        roles: roleList.USER || "USER",
        countrycode: countryCode,
        fcmToken: fcmToken,
        status:"pending"
      };
      await insertQuery("users", data);
    }
    let userFinalDetails = await findOne("users", {
      "mobileNumber.value": number,
    });
    return SuccessResponse(res, req.t("success_status_1"), userFinalDetails);
  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};
const verifyPhoneNumber = async (req, res) => {
  try {
    const { userId, mobileNumber, otp } = req.body;
    if (!userId || !otp || !mobileNumber) {
      return BadRequestResponse(res, req.t("failure_message_1"));
    }
    const existUser = await findOne(
      "users",
      {
        _id: new mongoose.Types.ObjectId(userId),
        "mobileNumber.value": mobileNumber,
      },
      "+pincode"
    );
    if (!existUser) {
      return BadRequestResponse(res, req.t("failure_message_2"));
    }

    let serverToken = generateServerToken(32);
    await update(
      "users",
      { _id: userId, "mobileNumber.value": mobileNumber },
      {
        "mobileNumber.verified": true,
        serverToken: serverToken,
        loginStatus: "loggedIn",
        appInstalledStatus: "installed",
      }
    );

    let token = req.headers.authorization.split(" ")[1];
    // if (!token) {
      let roles = Object.keys(existUser.roles);
      let newToken = jwt.sign(
        {
          info: {
            id: existUser._id,
            roles: roles,
          },
          date: Date.now(),
        },
          JWT_SECRET,
        {
          expiresIn: JWT_EXPIRES_IN,
        }
      );
      let jwtDetails = await findOne("tokenData", { token: token });

      jwtDetails.token = newToken;
      jwtDetails.id = existUser._id;
      jwtDetails.deviceId = "";

      await insertQuery("tokenData", jwtDetails);
    // }
    const userDetails = await findOne(
      "users",
      {
        _id: new mongoose.Types.ObjectId(userId),
        "mobileNumber.value": mobileNumber,
      },
    );
    return SuccessResponse(res, req.t("success_status_1"), userDetails);
  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

const resendOTP = async (req, res) => {
    try {
        const { userId } = req.params;
         console.log("1")
        // // Assuming you have a function to generate OTP
        // const otp = generateOTP(); 
        console.log("2")
        const existingUser = await findOne("users", { _id: new mongoose.Types.ObjectId("667268c0f96e6c38e83bb01f") });
        console.log("3")
        if (!existingUser) {
          return BadRequestResponse(res, 'User not found');
        }
        console.log("4")
        const result = {
          OTP: "1234",
        }
        console.log("5")
        return SuccessResponse(res, 'OTP sent successfully', result);
    } catch (error) {
      console.log(error,"gg")
        return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, error);
    }
};

const userLogout=async(req,res)=>{
  try{
    const {userId} = req.body;
    if (!userId) {
      return BadRequestResponse(res, req.t("failure_message_1"));
    }
    await update(
      "users",
      { _id: userId },
      {loginStatus : "loggedOut", serverToken: ''}
    );
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      let token = req.headers.authorization.split(" ")[1]
      if(token){
        await deleteQuery("tokenData",{token: token})
      }
    }
    return SuccessResponse(res, 'User logout successfully');
  } catch (error) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, error);
  }
}
export {
    userLogin,
    resendOTP,
    verifyPhoneNumber,
    userLogout,
}