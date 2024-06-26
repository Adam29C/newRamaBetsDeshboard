import jwt from "jsonwebtoken";
import { Users } from "../models/users.js";
import { TokenData } from "../models/token.js";
import { InvalidTokenResponse, BadRequestResponse, InternalServerErrorResponse, HTTP_MESSAGE } from './../helpers/http.js';
import { JWT_SECRET } from "../config/env.config.js";

const authMiddleware = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (!decoded) {
        return InvalidTokenResponse(res, HTTP_MESSAGE.UNKNOWN_ERROR);
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
            return InvalidTokenResponse(res, HTTP_MESSAGE.UNKNOWN_ERROR);
          }
          const currentUser = await Users.findById(decoded.info.id);
          if (!currentUser) {
            return BadRequestResponse(res, HTTP_MESSAGE.NOT_FOUND);
          }
          if (currentUser.status === "deactivated") {
            return BadRequestResponse(res, HTTP_MESSAGE.ACCOUNT_STATUS);
          }
        }
        if (decoded.info.roles === "ADMIN") {
          let adminDetails = await admin.findOne({ _id: decoded.info.id });
          if (!adminDetails) {
            return BadRequestResponse(res, HTTP_MESSAGE.NOT_FOUND);
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
          return BadRequestResponse(res, HTTP_MESSAGE.NOT_FOUND);
        }
        req.roles = decoded.info.roles;
      }
    }
  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }


  next();
};

export { authMiddleware };
