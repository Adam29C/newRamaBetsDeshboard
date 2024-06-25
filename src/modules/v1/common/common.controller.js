import jwt from "jsonwebtoken";
import { findOne, insertQuery, update } from "./../../../helpers/crudMongo.js";
import {
  HTTP_MESSAGE,
  InternalServerErrorResponse,
  SuccessResponse,
  BadRequestResponse,
} from "./../../../helpers/http.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "./../../../config/env.config.js";
import admin from "../../../models/admin.js";
import mongoose from "mongoose";
import { createToken } from "../../../helpers/token.js";

const generateAuthToken = async (req, res) => {
  try {
    const { id, deviceId } = req.body;
    let query;
    let details;
    let roles = "USER"; // Default role if not found
    if (id) {
      // Check if ID exists in admin or users collections
      details = await findOne("admin", { _id: id }) || await findOne("users", { _id: id });
      if (!details) {
        return BadRequestResponse(res, req.t("failure_message_2"));
      }
      roles = details.role; // Set roles from found details
      query = { id: id };
    }

    if (deviceId) {
      query = { deviceId: deviceId };
    }

    // Create the token
    const token = await createToken(id, deviceId, roles, query);
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
