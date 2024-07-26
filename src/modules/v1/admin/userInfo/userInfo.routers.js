import express from "express"
import {
  ValidationSource,
    validator,
  } from "../../../../middlewares/validator.js";
const userDetailsRouters = express.Router();
import { verifyToken } from "../../../../helpers/token.js";
import {blockUser, deleteUser, getDeleteUser, getUserIdea, userInfoById, userList} from "./userInfo.controller.js";
import { roleList } from "../../../../consts/authorization.js";
import {verifyRoles} from "../../../../middlewares/verifyRoles.js";
import  getMulterStorage from "../../../../helpers/fileUpload.js";  
const systemInformition = getMulterStorage("uploads/systemInfo");
import { blockUserSchema, userListSchema,deleteUserSchema,userIdiaSchema } from "./userInfo.schema.js";

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
  validator(deleteUserSchema,ValidationSource.BODY),
  deleteUser
);

userDetailsRouters.get(
  "/UserIdea",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(userIdiaSchema,ValidationSource.QUERY),
  getUserIdea
);

userDetailsRouters.get(
  "/getDeleteUser",
  verifyToken,
  verifyRoles(roleList.ADMIN),
  validator(userIdiaSchema,ValidationSource.QUERY),
  getDeleteUser
);

export { userDetailsRouters }; 