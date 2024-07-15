import { findOne, insertQuery, deleteQuery, update, findAll } from '../../../../helpers/crudMongo.js';
import { HTTP_MESSAGE, InternalServerErrorResponse, SuccessResponse, BadRequestResponse, NotFoundResponse } from '../../../../helpers/http.js';
import { GameProvider } from '../../../../models/gameProvider.js';
import { GameSetting } from "../../../../models/gameSetting.js";


// Function for adding a game setting
const addGameSetting = async (req, res) => {
  try {
    const { adminId, gameType, providerId, gameDay, OBT, CBT, OBRT, CBRT, isClosed } = req.body;

    // Check if the admin exists
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    // Check if the providerId exists in GameProvider collection
    const gameProvider = await findOne("GameProvider", { _id: providerId });
    if (!gameProvider) {
      return BadRequestResponse(res, "Provider not found in GameProvider collection");
    }
    // Extract providerName from gameProvider
    const providerName = gameProvider.providerName; // Adjust this based on your GameProvider schema

    // Prepare game setting details including providerName
    const gameSettingDetails = {
      gameType,
      providerId,
      providerName, // Add providerName field
      gameDay,
      OBT,
      CBT,
      OBRT,
      CBRT,
      isClosed
    };

    // Insert new game setting
    const newGameSetting = await insertQuery("GameSetting", gameSettingDetails);
    return SuccessResponse(res, HTTP_MESSAGE.GAME_SETTING_CREATED, { details: newGameSetting });

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};


// Function for Update a game setting
const updateGameSetting = async (req, res) => {
  try {
    const { adminId, gameSettingId, gameDay, OBT, CBT, OBRT, CBRT, isClosed } = req.body;

    // Check if the admin exists
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    // Check if the game setting exists
    const gameSettingDetails = await findOne("GameSetting", { _id: gameSettingId });
    if (!gameSettingDetails) {
      return NotFoundResponse(res, HTTP_MESSAGE.GAME_SETTING_NOT_FOUND);
    }

    // Update game setting details
    const updateFields = {};
    if (gameDay !== undefined) updateFields.gameDay = gameDay;
    if (OBT !== undefined) updateFields.OBT = OBT;
    if (CBT !== undefined) updateFields.CBT = CBT;
    if (OBRT !== undefined) updateFields.OBRT = OBRT;
    if (CBRT !== undefined) updateFields.CBRT = CBRT;
    if (isClosed !== undefined) updateFields.isClosed = isClosed;

    // Perform the update
    const updatedGameSetting = await updateQuery("GameSetting", { _id: gameSettingId }, updateFields, "findOneAndUpdate");

    return SuccessResponse(res, HTTP_MESSAGE.GAME_SETTING_UPDATE, { details: updatedGameSetting });

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

// Function for deleting a game setting
const deleteGameSetting = async (req, res) => {
  try {
    const { adminId, gameSettingId } = req.body;

    // Check if the admin exists
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    // Check if the game setting exists
    const gameSettingDetails = await findOne("GameSetting", { _id: gameSettingId });
    if (!gameSettingDetails) {
      return NotFoundResponse(res, HTTP_MESSAGE.GAME_SETTING_NOT_FOUND);
    }

    // Delete the game setting
    await deleteQuery("GameSetting", { _id: gameSettingId }, "deleteOne");
    return SuccessResponse(res, HTTP_MESSAGE.GAME_SETTING_DELETED);

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

// Function for all Provider setting 
const gameSettingList = async (req, res) => {
  try {
    const { adminId } = req.query;

    // Check if the admin exists
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    // Fetch all game settings
    const gameSettings = await findAll("GameSetting", {});

    // Transform the game settings array into the desired format
    const transformedGameSettings = gameSettings.map(setting => ({
      _id: setting._id,
      gameType: setting.gameType,
      providerId: setting.providerId,
      gameDay: setting.gameDay,
      OBT: setting.OBT,
      CBT: setting.CBT,
      OBRT: setting.OBRT,
      CBRT: setting.CBRT,
      isClosed: setting.isClosed
    }));

    // Prepare the response in the desired format
    const response = {
      details: {
        gameName: {}, // You may need to populate this based on your actual data structure
        gameDay: transformedGameSettings
      }
    };

    return SuccessResponse(res, HTTP_MESSAGE.GAME_SETTING_LIST, response);

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};


// Function for all Provider setting 
const gameSettingById = async (req, res) => {
  try {
    const { gameSettingId } = req.params;

    // Check if the game setting exists
    const gameSettingDetails = await findOne("GameSetting", { _id: gameSettingId });
    if (!gameSettingDetails) {
      return NotFoundResponse(res, HTTP_MESSAGE.GAME_SETTING_NOT_FOUND);
    }

    // Prepare the response for game setting info
    return SuccessResponse(res, HTTP_MESSAGE.GAME_SETTING_DETAILS, { details: gameSettingDetails });

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

export { addGameSetting, updateGameSetting, deleteGameSetting, gameSettingList, gameSettingById };
