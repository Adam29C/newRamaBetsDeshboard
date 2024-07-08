import express from "express"
import {
  ValidationSource,
    validator,
  } from "../../../../middlewares/validator.js";
const userDetailsRouters = express.Router();
import { verifyToken } from "../../../../helpers/token.js";
import {blockUser, deleteUser, userInfoById, userList} from "./userInfo.controller.js";
import { roleList } from "../../../../consts/authorization.js";
import {verifyRoles} from "../../../../middlewares/verifyRoles.js";
import  getMulterStorage from "../../../../helpers/fileUpload.js";  
const systemInformition = getMulterStorage("uploads/systemInfo");
import { blockUserSchema, userListSchema } from "./userInfo.schema.js";

userDetailsRouters.get(
  "/users/:adminId",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(userListSchema,ValidationSource.PARAM),
  userList
);

userDetailsRouters.get(
  "/users",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(userListSchema, ValidationSource.BODY),
  userInfoById
);

userDetailsRouters.put(
  "/users",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(blockUserSchema,ValidationSource.BODY),
  blockUser
);

userDetailsRouters.delete(
  "/users",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(userListSchema,ValidationSource.BODY),
  deleteUser
);

export { userDetailsRouters }; 