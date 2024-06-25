import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { HTTP_MESSAGE, InternalServerErrorResponse, SuccessResponse, BadRequestResponse } from '../../../helpers/http.js';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../../../config/env.config.js';
import Admin from '../../../models/admin.js';
import { createToken } from '../../../helpers/token.js';
import { findOne, insertQuery, update } from '../../../helpers/crudMongo.js';

//Function For Admin Login Api 
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

//Function For Admin View Profile Api
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

//Function For Admin Chang Password Api
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

//Function For Admin Created Employee Api
const createEmployee = async (req, res) => {
  try {
    const { adminId, employeeName, username, password, designation, permission } = req.body;
    const details = await findOne("Admin", { _id: adminId });
    if (!details) {
      return BadRequestResponse(res, req.t("failure_message_2"));
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const employeeDetails = {
      employeeName: employeeName,
      username:username,
      password: hashedPassword,
      knowPassword:password,
      designation:designation,
      permission:permission
    };
    await insertQuery("Admin", employeeDetails);
    return SuccessResponse(res, req.t("success_status"), { details: employeeDetails });
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      req.t("internal_server_error_message"),
      err
    );
  }
};

//Function For Admin Block Employee api
const blockEmployee = async (req, res) => {
  try {
    const { adminId, empId } = req.body;

    const details = await findOne("Admin", { _id: adminId });
    if (!details) {
      return BadRequestResponse(res, req.t("failure_message_2"));
    }

    const empDetails = await findOne("Admin", { _id: empId });
    if (!empDetails) {
      return BadRequestResponse(res, req.t("failure_message_2"));
    }
    const updateData = {
      isBlock:true
    };
    const updatedDetails = await update("Admin", { _id: empId }, updateData, "findOneAndUpdate");
    return SuccessResponse(res, req.t("success_status"), { details: updatedDetails });
  } catch (err) {
    return InternalServerErrorResponse(
      res,
      req.t("internal_server_error_message"),
      err
    );
  }
};

//Function For List Of Employee api
const empList = async (req, res) => {
  try {
    const { adminId} = req.body;

    const details = await findOne("Admin", { _id: adminId });
    if (!details) {
      return BadRequestResponse(res, req.t("failure_message_2"));
    }

    const list = await Admin.find({});
    return SuccessResponse(res, req.t("success_status"), { details: list });

  } catch (err) {
    return InternalServerErrorResponse(
      res,
      req.t("internal_server_error_message"),
      err
    );
  }
};

export { adminLogin, adminProfile, changePassword, createEmployee, blockEmployee, empList};
