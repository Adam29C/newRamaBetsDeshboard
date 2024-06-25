import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { HTTP_MESSAGE, InternalServerErrorResponse, SuccessResponse, BadRequestResponse } from '../../../helpers/http.js';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../../../config/env.config.js';
import Admin from '../../../models/admin.js'; 
import { createToken } from '../../../helpers/token.js';
import { findOne, insertQuery, update } from '../../../helpers/crudMongo.js';

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const details = await findOne("Admin", { username: username }); 
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

const adminProfile = async (req, res) => {
  try {
    const { adminId } = req.body;
    const details = await findOne("Admin", { _id: adminId });
    if (!details) {
      return BadRequestResponse(res, req.t("failure_message_2"));
    }
    return SuccessResponse(res, req.t("success_status"), { details });
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      req.t("internal_server_error_message"),
      err
    );
  }
};

const changePassword = async (req, res) => {
  try {
    const { adminId, password } = req.body;
    const details = await findOne("Admin", { _id: adminId });
    if (!details) {
      return BadRequestResponse(res, req.t("failure_message_2"));
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const updateData = {
      password: hashedPassword,
      knowPassword: password,
    };
    const updatedDetails = await update("Admin", { _id: adminId }, updateData, "findOneAndUpdate");
    return SuccessResponse(res, req.t("success_status"), { details: updatedDetails });
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      req.t("internal_server_error_message"),
      err
    );
  }
};

export { adminLogin, adminProfile, changePassword };
