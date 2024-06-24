import jwt from "jsonwebtoken";
import { findOne, insertQuery, update } from "./../../../helpers/crudMongo.js";
import {
  HTTP_MESSAGE,
  InternalServerErrorResponse,
  SuccessResponse,
  BadRequestResponse,
} from "./../../../helpers/http.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "./../../../config/env.config.js";
import admin from "../../../models/admin.js"
import mongoose from "mongoose";

const generateAuthToken = async (req, res) => {
  try {
    const { id, deviceId } = req.body;
    let query;
    let details;
    let token;
    let roles = "USER"; 

    if (id) {
      details = await findOne("admin", { _id: id }) || await findOne("users", { _id: id });
      if (!details) {
        return BadRequestResponse(res, req.t("failure_message_2"));
      }
      roles = details.role;
      query = { id: id };
    }

    if (deviceId) {
      query = { deviceId: deviceId };
    }

    token = jwt.sign(
      {
        info: {
          id: id ? id : "",
          deviceId: deviceId ? deviceId : "",
          roles: roles,
        },
        date: Date.now(),
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    let data = await findOne("TokenData", query);
    if (data) {
      await update("TokenData", { _id: data._id }, { token: token });
    } else {
      const tokenData = {
        token: token,
        deviceId: deviceId ? deviceId : "",
      };

      if (id && mongoose.Types.ObjectId.isValid(id)) {
        tokenData.userId = id;
      }

      await insertQuery("TokenData", tokenData);
    }

    return SuccessResponse(res, req.t("success_status"), { token });
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      err
    );
  }
};

export { generateAuthToken };
