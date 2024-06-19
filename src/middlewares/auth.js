import jwt from "jsonwebtoken";
import { Users } from "../models/users.js";
import { TokenData } from "../models/token.js";
import { InvalidTokenResponse, BadRequestResponse, InternalServerErrorResponse, HTTP_MESSAGE } from './../helpers/http.js';
import { JWT_SECRET } from "../config/env.config.js";
const authMiddleware = async (req, res, next) => {
  let token;
  console.log("test")
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // verify token
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (!decoded) {
        return InvalidTokenResponse(res, req.t("failure_message_3")); // use response function
      }
      if (decoded.info.id) {
        if (decoded.info.roles === "USER") {
          await Users.findOneAndUpdate(
            { _id: decoded.info.id },
            { ipAddress: req.connection.remoteAddress }
          );
          let data = await TokenData.findOne({
            token: token,
            userId: decoded.info.id,
          });
          if (!data) {
            return InvalidTokenResponse(res, req.t("failure_message_4")); // use response function
          }

          const currentUser = await Users.findById(decoded.info.id);
          if (!currentUser) {
            return BadRequestResponse(res, req.t("failure_message_5")); // use response function
          }
          if (currentUser.status == "deactivated") {
            return BadRequestResponse(res, req.t("failure_message_6")); // use response function
          }
        }
        if (decoded.info.roles === "ADMIN") {
          let adminDetails = await admin.findOne({ _id: decoded.info.id });
          if (adminDetails) {
            return BadRequestResponse(res, req.t("failure_message_5")); // use response function
          }
        }
        req.user = decoded.info.id;
        req.roles = decoded.info.roles;
      } else {
        let data = await TokenData.findOne({
          token: token,
          deviceId: decoded.info.deviceId,
        });
        if (!data) {
          return BadRequestResponse(res, req.t("failure_message_3")); // use response function
        }
        req.roles = decoded.info.roles;
      }
    } catch (err) {
      console.log(err)
      return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err); // use response function
    }
  }
  next();
};

export { authMiddleware };

