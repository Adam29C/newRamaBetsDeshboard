import { findOne, insertQuery, deleteQuery, update, findAll } from '../../../../helpers/crudMongo.js';
import { HTTP_MESSAGE, InternalServerErrorResponse, SuccessResponse, BadRequestResponse, NotFoundResponse } from '../../../../helpers/http.js';
import { GameProvider } from '../../../../models/gameProvider.js';
import { GameSetting } from "../../../../models/gameSetting.js";



const addGameSetting = async (req, res) => {
  try {
    const { gameType, adminId, providerId, gameDay, OBT, CBT, OBRT, CBRT, isClosed } = req.body;
    
    // Check Admin exists
    const adminInfo = await findOne("Admin", { _id: adminId });
    if (!adminInfo) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    // Check Provider exists
    const providerInfo = await findOne("GameProvider", { _id: providerId });
    if (!providerInfo) {
      return BadRequestResponse(res, HTTP_MESSAGE.GAME_PROVIDER_NOT_FOUND);
    }

    // Find the game setting for the provider
    let gameSettingInfo = await GameSetting.findOne({ providerId });

    if (!gameSettingInfo) {
      // If no game setting exists for the provider, create a new one
      const insertingObj = {
        gameType,
        providerId,
        providerName: providerInfo.providerName,
        gameSatingInfo: [{
          gameDay,
          OBT,
          CBT,
          OBRT,
          CBRT,
          isClosed
        }]
      };
      
      gameSettingInfo = await GameSetting.create(insertingObj);

      // Respond with success
      return SuccessResponse(res, HTTP_MESSAGE.SUCCESS, gameSettingInfo);

    } else {
      // Check if the game day already exists in the gameSatingInfo array
      const existingGameDayIndex = gameSettingInfo.gameSatingInfo.findIndex(info => info.gameDay === gameDay);

      if (existingGameDayIndex !== -1) {
        // If the game day already exists, return an error response
        return BadRequestResponse(res, HTTP_MESSAGE.GAME_DAY_ENTRY_ALLREADY_EXIST);
      }

      // Add a new entry to gameSatingInfo array
      gameSettingInfo.gameSatingInfo.push({
        gameDay,
        OBT,
        CBT,
        OBRT,
        CBRT,
        isClosed
      });

      // Save the updated game setting document
      gameSettingInfo = await gameSettingInfo.save();

      // Respond with success
      return SuccessResponse(res, HTTP_MESSAGE.SUCCESS, gameSettingInfo);
    }

  } catch (err) {
    // Handle errors
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
}


// Function for Update a game setting
const updateGameSetting = async (req, res) => {
  try {
    const { adminId, providerId,gameSettingId, gameDay, OBT, CBT, OBRT, CBRT, isClosed } = req.body;
     //we take the gameSettingId for the feture aspect 
    // Check if the admin exists
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    // Check if the providerDetails exists
    const providerDetails = await findOne("GameSetting", { providerId: providerId });
    if (!providerDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.GAME_PROVIDER_NOT_FOUND);
    }

    // Update game setting details based on providerId and gameDay conditions
    if (providerId && gameDay) {
      // Update specific game day entry
      const filter = { providerId: providerId, 'gameSatingInfo.gameDay': gameDay };
      const updateFields = {};
      if (OBT !== undefined) updateFields['gameSatingInfo.$.OBT'] = OBT;
      if (CBT !== undefined) updateFields['gameSatingInfo.$.CBT'] = CBT;
      if (OBRT !== undefined) updateFields['gameSatingInfo.$.OBRT'] = OBRT;
      if (CBRT !== undefined) updateFields['gameSatingInfo.$.CBRT'] = CBRT;
      if (isClosed !== undefined) updateFields['gameSatingInfo.$.isClosed'] = isClosed;

      await GameSetting.updateOne(filter, { $set: updateFields });

      // Fetch updated document to return in response
      const updatedGameSetting = await GameSetting.findOne(filter);

      return SuccessResponse(res, HTTP_MESSAGE.GAME_SETTING_UPDATE, { details: updatedGameSetting });
    } else if (providerId) {
      // Update all game days entries for the provider
      const filter = { providerId: providerId };
      const updateFields = {};
      if (OBT !== undefined) updateFields['gameSatingInfo.$[].OBT'] = OBT;
      if (CBT !== undefined) updateFields['gameSatingInfo.$[].CBT'] = CBT;
      if (OBRT !== undefined) updateFields['gameSatingInfo.$[].OBRT'] = OBRT;
      if (CBRT !== undefined) updateFields['gameSatingInfo.$[].CBRT'] = CBRT;
      if (isClosed !== undefined) updateFields['gameSatingInfo.$[].isClosed'] = isClosed;

      await GameSetting.updateMany(filter, { $set: updateFields });
      // Fetch updated documents to return in response
      const updatedGameSettings = await GameSetting.find(filter);

      return SuccessResponse(res, HTTP_MESSAGE.GAME_SETTING_UPDATE, { details: updatedGameSettings });
    } else {
      return BadRequestResponse(res, "Either providerId or providerId with gameDay must be provided");
    }

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

const gameSettingList = async (req, res) => {
  try {
    const { adminId } = req.query;

    // Check if the admin exists
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    // Fetch all game settings
    let gameSettings = await findAll("GameSetting", {});

    // Sort gameSettings by gameDay
    gameSettings.forEach(setting => {
      setting.gameSatingInfo.sort((a, b) => {
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return daysOfWeek.indexOf(a.gameDay) - daysOfWeek.indexOf(b.gameDay);
      });
    });

    // Respond with sorted gameSettings
    return SuccessResponse(res, HTTP_MESSAGE.GAME_SETTING_LIST, gameSettings);

  } catch (err) {
    // Handle errors
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
