import jwt from "jsonwebtoken";
import { findOne, insertQuery, update } from "../../../helpers/crudMongo.js";
import bcrypt from "bcrypt";
import {
  HTTP_MESSAGE,
  InternalServerErrorResponse,
  SuccessResponse,
  BadRequestResponse,
} from "../../../helpers/http.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../../../config/env.config.js";
import admin from "../../../models/admin.js";
import mongoose from "mongoose";
import { createToken } from "../../../helpers/token.js";

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const details = await admin.findOne({ username: username });
    if (!details) {
      return BadRequestResponse(res, req.t("failure_message_2"));
    }
    const match = await bcrypt.compare(password, details.password);
    if (!match) {
      return BadRequestResponse(res, "Please provide the correct password");
    }

    const id = details._id;
    const deviceId = "";
    const roles = details.role; 
    const query = { id: id };

    const token = await createToken(id, deviceId, roles, query);
    return SuccessResponse(res, req.t("success_status"), { token });
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      req.t("internal_server_error_message"),
      err
    );
  }
};

export { adminLogin };
