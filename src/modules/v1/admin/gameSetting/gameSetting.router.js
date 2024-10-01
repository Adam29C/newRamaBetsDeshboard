import express from "express";
import {
  ValidationSource,
  validator,
} from "../../../../middlewares/validator.js";
import { verifyToken } from "../../../../helpers/token.js";
import {
  addGameSetting,
  updateGameSetting,
  deleteGameSetting,
  gameSettingList,
  gameSettingById,
  addCard,
  updateCard,
  cardList,
  deleteCard,
} from "./gameSetting.controller.js";
import { roleList } from "../../../../consts/authorization.js";
import { verifyRoles } from "../../../../middlewares/verifyRoles.js";
import {
  gameSettingSchema,
  deleteGameSettingSchema,
  updateGameSettingSchema,
  gameProviderListSchema,
  gameProviderIdSchema,
  addCardSchema,
} from "./gameSetting.schema.js";

// Import the getMulterStorage helper
import getMulterStorage from "../../../../helpers/fileUpload.js"; // Adjust the path to where you placed this helper

const gameSettingRouters = express.Router();

// Middleware for handling file upload (for the "addCard" route)
const uploadSingle = getMulterStorage("cardImage").single("cardImage"); // 'cardImage' is the name of the file input field in the form

// Routes
gameSettingRouters.post(
  "/gameSetting",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(gameSettingSchema, ValidationSource.BODY),
  addGameSetting
);

gameSettingRouters.put(
  "/gameSetting",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(updateGameSettingSchema, ValidationSource.BODY),
  updateGameSetting
);

gameSettingRouters.delete(
  "/gameSetting",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(deleteGameSettingSchema, ValidationSource.BODY),
  deleteGameSetting
);

gameSettingRouters.get(
  "/gameSetting",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(gameProviderListSchema, ValidationSource.QUERY),
  gameSettingList
);

gameSettingRouters.get(
  "/gameSetting/:gameSettingId",
  verifyToken,
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),
  validator(gameProviderIdSchema, ValidationSource.PARAM),
  gameSettingById
);

gameSettingRouters.post(
  "/addCard",
  verifyToken, 
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN), 
  // validator(addCardSchema, ValidationSource.BODY),
  uploadSingle, 
  addCard 
);

gameSettingRouters.put(
  "/updateCard",
  verifyToken, 
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN), 
  uploadSingle, 
  updateCard 
);

gameSettingRouters.post(
  "/cardList",
  verifyToken, 
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),  
  cardList 
);

gameSettingRouters.delete(
  "/deleteCard",
  verifyToken, 
  verifyRoles(roleList.ADMIN, roleList.SUBADMIN),  
  deleteCard 
);

export { gameSettingRouters };
