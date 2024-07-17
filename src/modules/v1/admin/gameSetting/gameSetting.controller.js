import { findOne, insertQuery, deleteQuery, update, findAll } from '../../../../helpers/crudMongo.js';
import { HTTP_MESSAGE, InternalServerErrorResponse, SuccessResponse, BadRequestResponse, NotFoundResponse } from '../../../../helpers/http.js';
import { GameProvider } from '../../../../models/gameProvider.js';
import { GameSetting } from "../../../../models/gameSetting.js";

const addGameSetting = async(req,res)=>{
  try{
    const {adminId,providerId,gameDay,OBT,CBT,OBRT,CBRT,isClosed}=req.body;
    console.log(req.body);
    
    //check Admin is exist
    const adminInfo = await findOne("Admin",{_id:adminId});
    if (!adminInfo) return BadRequestResponse(res,HTTP_MESSAGE.USER_NOT_FOUND);

    //check Provider is exist
    const providerInfo = await findOne("GameProvider",{_id:providerId});
    if (!providerInfo) return BadRequestResponse(res,HTTP_MESSAGE.GAME_PROVIDER_NOT_FOUND);

    
    //check game satting if the provider is already exist or not 
    const gameSettingInfo = await findOne("GameSetting",{providerId:providerId});

    const insertingObj={
      providerId,
      gameDay,
      OBT,
      CBT,
      OBRT,
      CBRT,
      isClosed
    }
    if(gameSettingInfo){
       await insertQuery("GameSatting",insertingObj)    
    }else{
      await insertQuery("GameSatting",insertingObj) 
      console.log("game satting new")

      await insertQuery("TokenData", tokenData);
    }

    

  }catch(err){
    return InternalServerErrorResponse(res,HTTP_MESSAGE.INTERNAL_SERVER_ERROR,err)
  }
}







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

    // Group game settings by gameName
    const groupedSettings = gameSettings.reduce((acc, setting) => {
      const gameName = setting.providerName || "Unknown";
      if (!acc[gameName]) {
        acc[gameName] = [];
      }
      acc[gameName].push({
        gameDay: setting.gameDay,
        obt: setting.OBT,
        cbt: setting.CBT,
        obrt: setting.OBRT,
        cbrt: setting.CBRT,
        isClosed: setting.isClosed
      });
      return acc;
    }, {});

    // Prepare the final response structure
    const response = Object.keys(groupedSettings).map(gameName => ({
      gameName,
      info: groupedSettings[gameName]
    }));

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
