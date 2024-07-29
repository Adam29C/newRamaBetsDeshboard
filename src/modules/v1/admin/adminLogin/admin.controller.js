import bcrypt from 'bcrypt';
import { HTTP_MESSAGE, InternalServerErrorResponse, SuccessResponse, BadRequestResponse, UnauthorizedResponse } from '../../../../helpers/http.js';
import Admin from '../../../../models/admin.js';
import System from '../../../../models/system.js';
import { createToken } from '../../../../helpers/token.js';
import { findOne, insertQuery, update, deleteQuery, countRecords, findAll } from '../../../../helpers/crudMongo.js';
import {Users} from "../../../../models/users.js"
import { GameProvider } from '../../../../models/gameProvider.js';
import { VersionSetting } from '../../../../models/versionSetting.js';
import moment from 'moment';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Function For Admin Login Api 
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const details = await findOne("Admin", { username: username });

    if (!details) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
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
    return SuccessResponse(res, HTTP_MESSAGE.LOGIN, { token: token, roles: details.role, id: id, isBlock: details.isBlock });

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

//First Time Add The System Info
const addSystemInfo = async (req, res) => {
  try {
    const { adminId, title } = req.body;
    const details = await findOne("Admin", { _id: adminId });
    if (!details) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    const logo = req.files?.logo ? req.files.logo[0].location : null;
    const favIcon = req.files?.favIcon ? req.files.favIcon[0].location : null;
    const backgroundImage = req.files?.backgroundImage ? req.files.backgroundImage[0].location : null;

    const newData = {
      adminId,
      title,
      logo,
      favIcon,
      backgroundImage,
    };

    const newDetails = await insertQuery("System", newData);
    return SuccessResponse(res, HTTP_MESSAGE.ADD_SYSINFO, { details: newDetails });

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

//Update System Info
const updateSystemInfo = async (req, res) => {
  const { adminId, systemInfoId, title } = req.body;

  try {
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    const systemInfo = await findOne("System", { _id: systemInfoId });
    if (!systemInfo) {
      return BadRequestResponse(res, HTTP_MESSAGE.NOT_FOUND);
    }
    const updateData = {};
    if (req.files?.logo) {
      updateData.logo = req.files.logo[0].location;
    }
    if (req.files?.favIcon) {
      updateData.favIcon = req.files.favIcon[0].location;
    }
    if (req.files?.backgroundImage) {
      updateData.backgroundImage = req.files.backgroundImage[0].location;
    }
    if (title) {
      updateData.title = title;
    }

    const options = { new: true };
    const updatedDetails = await update("System", { _id: systemInfoId }, updateData, "findOneAndUpdate", options);

    if (!Object.keys(updateData).length) {
      return BadRequestResponse(res, HTTP_MESSAGE.BAD_REQUEST, "No valid fields to update.");
    }

    return SuccessResponse(res, HTTP_MESSAGE.UPDATE_SYSINFO, { details: updatedDetails });

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
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }
    return SuccessResponse(res, HTTP_MESSAGE.ADMIN_PROFILE, { details });
  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

//Function For Admin Chang Password Api
const changePassword = async (req, res) => {
  try {
    const { id, password } = req.body;
    const details = await findOne("Admin", { _id: id });
    if (!details) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const updateData = {
      password: hashedPassword,
      knowPassword: password,
    };

    const updatedDetails = await update("Admin", { _id: id }, updateData, "findOneAndUpdate");
    return SuccessResponse(res, HTTP_MESSAGE.PASSWORD_CHANGE, { details: updatedDetails });

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

//Function For Admin Created Employee Api
const createEmployee = async (req, res) => {
  try {
    const { adminId, employeeName, username, password, designation,loginPermission, permission } = req.body;
    const details = await findOne("Admin", { _id: adminId });
    if (!details) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }
    
    //Check if the userName already exist
    const checkUserName = await findOne("Admin",{username})   
    if(checkUserName){
      return BadRequestResponse(res,HTTP_MESSAGE.USERNAME_EXIST)
    }
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const employeeDetails = {
      employeeName,
      username,
      password: hashedPassword,
      knowPassword: password,
      designation,
      loginPermission,
      permission,
      role: "SUBADMIN"
    };

    await insertQuery("Admin", employeeDetails);

    // Exclude password and knowPassword from the response
    const responseDetails = {
      employeeName,
      username,
      designation,
      permission,
      loginPermission,
      role:"SUBADMIN"
    };

    return SuccessResponse(res, HTTP_MESSAGE.CREATED_EMPLOGEE, { details: responseDetails });

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

// Function For Admin Block Employee API
const blockEmployee = async (req, res) => {
  try {
    const { adminId, empId, isBlock } = req.body;

    // Validate adminId
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    // Validate empId
    const empDetails = await findOne("Admin", { _id: empId });
    if (!empDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    // Update Employee block status
    await update("Admin", { _id: empId }, { isBlock });

    // Determine the response message
    const message = isBlock ? HTTP_MESSAGE.BLOCK_EMPLOYEE : HTTP_MESSAGE.UNBLOCK_EMPLOYEE;

    // Respond with the appropriate message
    return SuccessResponse(res, message);

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

//Function For List Of Employee api
const empList = async (req, res) => {
  try {
    const { adminId } = req.query;

    const details = await findOne("Admin", { _id: adminId });
    if (!details) {
      return BadRequestResponse(res, HTTP_MESSAGE.NOT_FOUND);
    }

    const list = await Admin.aggregate([
      { $match: { role: { $ne: 'ADMIN' } } },
      { $project: { password: 0, knowPassword: 0 } }
    ]);

    return SuccessResponse(res, HTTP_MESSAGE.EMP_LIST, { details: list });

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

//Function For Delete Employee Api
const deleteEmployee = async (req, res) => {
  try {
    const {empId,adminId} = req.body;

    const details = await findOne("Admin", { _id: adminId });
    if (!details) {
      return BadRequestResponse(res, HTTP_MESSAGE.NOT_FOUND);
    }
    
    const empDetails = await findOne("Admin", { _id: empId });
    if (!empDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.NOT_FOUND);
    }

    const deleteResponse = await deleteQuery(
      "Admin",
      { _id: empId },
      "deleteOne"
    );
    return SuccessResponse(res, HTTP_MESSAGE.DELETE_EMPLOYEE, deleteResponse);
  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR);
  }
};

//Function For Admin Change Employee Password Api
const changeEmployeePassword = async (req, res) => {
  try {
    const { adminId, empId, password } = req.body;
    const details = await findOne("Admin", { _id: adminId });
    if (!details) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    const empDetails = await findOne("Admin", { _id: empId });
    if (!empDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.EMPLOYEE_NOT_FOUND);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const updateData = {
      password: hashedPassword,
      knowPassword: password,
    };

    const updatedDetails = await update("Admin", { _id: empId }, updateData, "findOneAndUpdate");
    return SuccessResponse(res, HTTP_MESSAGE.PASSWORD_CHANGE, { details: updatedDetails });

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

//Function For Admin Update Employee Informition Api
const updateEmployeeInformition = async (req, res) => {
  try {
    const { adminId, empId,employeeName, username, permission,loginPermission } = req.body;
    const details = await findOne("Admin", { _id: adminId });

    if (!details) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    const empDetails = await findOne("Admin", { _id: empId });
    if (!empDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.EMPLOYEE_NOT_FOUND);
    }

    const updateData = {}
    if (employeeName) {
      updateData.employeeName = employeeName
    };
    if (username) {
      updateData.username = username
    };
    if (permission) {
      updateData.permission = permission
    }
    if (loginPermission) {
      updateData.loginPermission = loginPermission
    }
   
    await update("Admin", { _id: empId }, updateData);
    const responce=await findOne("Admin",{ _id: empId },{role:0,password:0,knowPassword:0})
    
    return SuccessResponse(res, HTTP_MESSAGE.EMP_UPDATE, { details: responce });

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

//Function For Get getPermission
const getPermission = async (req, res) => {
  try {
    const id = req.params.id;
    const details = await findOne("Admin", { _id: id }, { permission: 1 });

    if (!details) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    return SuccessResponse(res, HTTP_MESSAGE.GET_PERMISSION, { permission: details.permission });
  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

//Function For Get userList Api
const userList = async (req, res) => {
  try {
    const id = req.params.id;
    const details = await findOne("Admin", { _id: id });
    if (!details) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    const userDetails = await findOne("User", {});

    return SuccessResponse(res, HTTP_MESSAGE.USER_LIST, { details: userDetails });
  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

//Function For Get userList Api
const countDashboard = async (req, res) => {
  try {
    const id = req.params.id;
    const details = await findOne("Admin", { _id: id });
    if (!details) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }
    
    const [allUsers, loginUsers, bannedUsers, activeUsers] = await Promise.all([
      countRecords("Users", {}),
      countRecords("Users", { isLogin: true }),
      countRecords("Users", { isBlock: true }),
      countRecords("Users", { isLogin: true })
    ]);

    return SuccessResponse(res, HTTP_MESSAGE.USER_LIST, { allUsers, loginUsers, bannedUsers, activeUsers });
  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

//Function For To day register user 
const todayRegisterUsers = async(req, res) => {
  try {
    const { id } = req.params;

  //Fetch Admin Id is exist
  const details = await findOne("Admin",{_id:id},)
  if(!details){
    return BadRequestResponse(res,HTTP_MESSAGE.USER_NOT_FOUND,)
  }

  //Fetch User Id is exist
  const userDetails = await findOne("User",{},{name:1,mobile:1})
  if(!userDetails){
    return BadRequestResponse(res,HTTP_MESSAGE.USER_NOT_FOUND,)
  }
  
  return SuccessResponse(res,HTTP_MESSAGE.USER_INFO,userDetails)
  } catch (err) {
    return InternalServerErrorResponse(res,HTTP_MESSAGE.INTERNAL_SERVER_ERROR,res); 
  }
};

//Function For To day register user 
const updateGameStatus = async(req, res) => {
  try {
    const { adminId,id,status} = req.body;
  //Fetch Admin Id is exist
  const details = await findOne("Admin",{_id:adminId},)
  if(!details){
    return BadRequestResponse(res,HTTP_MESSAGE.USER_NOT_FOUND,)
  }

  const providerInfo = await findOne("GameProvider",{_id:id});
  if(!providerInfo){
    return BadRequestResponse(res,HTTP_MESSAGE.GAME_PROVIDER_NOT_FOUND)
  } 

  const updateField=status
  //Update Status
  await update("GameProvider",{_id:id},{updateField})
  
  return SuccessResponse(res,HTTP_MESSAGE.GAME_STATUS_UPDATED)
  } catch (err) {
    return InternalServerErrorResponse(res,HTTP_MESSAGE.INTERNAL_SERVER_ERROR,res); 
  }
};

export { adminLogin, adminProfile, changePassword, createEmployee, blockEmployee, empList, addSystemInfo, updateSystemInfo, deleteEmployee, changeEmployeePassword, updateEmployeeInformition, getPermission, userList, countDashboard,todayRegisterUsers,updateGameStatus };

