import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { HTTP_MESSAGE, InternalServerErrorResponse, SuccessResponse, BadRequestResponse, UnauthorizedResponse } from '../../../../helpers/http.js';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../../../../config/env.config.js';
import Admin from '../../../../models/admin.js';
import { createToken } from '../../../../helpers/token.js';
import { findOne, insertQuery, update } from '../../../../helpers/crudMongo.js';

//Function For Admin Login Api 
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const details = await findOne("Admin", { username: username });
    if (!details) {
      return BadRequestResponse(res, HTTP_MESSAGE.NOT_FOUND);
    }

    const match = await bcrypt.compare(password, details.password);
    if (!match) {
      return UnauthorizedResponse(res, HTTP_MESSAGE.WRONG_PASSWORD);
    }

    const id = details._id;
    const deviceId = "";
    const roles = details.role;
    const query = { id };
    const token = await createToken(id, deviceId, roles, query);
    return SuccessResponse(res, HTTP_MESSAGE.LOGIN, { token });

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

//Function For Admin View Profile Api
const adminProfile = async (req, res) => {
  try {
    const { adminId } = req.query;
    const details = await findOne("Admin", { _id: adminId });
    if (!details) {
      return BadRequestResponse(res, HTTP_MESSAGE.NOT_FOUND);
    }
    return SuccessResponse(res, HTTP_MESSAGE.ADMIN_PROFILE, { details });
  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

//Function For Admin Chang Password Api
const changePassword = async (req, res) => {
  try {
    const { adminId, password } = req.body;
    const details = await findOne("Admin", { _id: adminId });
    if (!details) {
      return BadRequestResponse(res, HTTP_MESSAGE.NOT_FOUND);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const updateData = {
      password: hashedPassword,
      knowPassword: password,
    };

    const updatedDetails = await update("Admin", { _id: adminId }, updateData, "findOneAndUpdate");
    return SuccessResponse(res, HTTP_MESSAGE.PASSWORD_CHANGE, { details: updatedDetails });

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

//Function For Admin Created Employee Api
const createEmployee = async (req, res) => {
  try {
    const { adminId, employeeName, username, password, designation, permission } = req.body;
    const details = await findOne("Admin", { _id: adminId });
    if (!details) {
      return BadRequestResponse(res, HTTP_MESSAGE.NOT_FOUND);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const employeeDetails = {
      employeeName: employeeName,
      username: username,
      password: hashedPassword,
      knowPassword: password,
      designation: designation,
      permission: permission
    };
    await insertQuery("Admin", employeeDetails);
    return SuccessResponse(res, HTTP_MESSAGE.CREATED_EMPLOGEE, { details: employeeDetails });
    
  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

//Function For Admin Block Employee api
const blockEmployee = async (req, res) => {
  try {
    const { adminId, empId } = req.body;

    const details = await findOne("Admin", { _id: adminId });
    if (!details) {
      return BadRequestResponse(res, HTTP_MESSAGE.NOT_FOUND);
    }

    const empDetails = await findOne("Admin", { _id: empId });
    if (!empDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.NOT_FOUND);
    }
    const updateData = {
      isBlock: true
    };
    const updatedDetails = await update("Admin", { _id: empId }, updateData, "findOneAndUpdate");
    return SuccessResponse(res, HTTP_MESSAGE.BLOCK_EMPLOYEE, { details: updatedDetails });
  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

//Function For List Of Employee api
const empList = async (req, res) => {
  try {
    const { adminId } = req.body;

    const details = await findOne("Admin", { _id: adminId });
    if (!details) {
      return BadRequestResponse(res, HTTP_MESSAGE.NOT_FOUND);
    }

    const list = await Admin.find({});
    return SuccessResponse(res, HTTP_MESSAGE.EMP_LIST, { details: list });

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};
// logo,fabIcon,backgrountImage
//Function For List Of Employee api
const updateSystemInfo = async (req, res) => {
  try {
    console.log("9999")
    const {adminId,text} = req.body;

    const details = await findOne("Admin", { _id: adminId });
    if (!details) {
      return BadRequestResponse(res, HTTP_MESSAGE.NOT_FOUND);
    }
    const updateData = {
      adminId:adminId,
      text:text
    };
    const updatedDetails = await update("System", { _id: adminId}, updateData, "findOneAndUpdate");
    return SuccessResponse(res, HTTP_MESSAGE.EMP_LIST, { details: updatedDetails });

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

export { adminLogin, adminProfile, changePassword, createEmployee, blockEmployee, empList, updateSystemInfo};
