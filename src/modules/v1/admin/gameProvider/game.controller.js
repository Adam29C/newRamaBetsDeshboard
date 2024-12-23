import { findOne, insertQuery, deleteQuery, update, findAll } from '../../../../helpers/crudMongo.js';
import { HTTP_MESSAGE, InternalServerErrorResponse, SuccessResponse, BadRequestResponse, NotFoundResponse } from '../../../../helpers/http.js';
import {GameProvider} from "../../../../models/gameProvider.js"

// Function for adding a game provider
const addGameProvider = async (req, res) => {
  try {
    const { adminId,gameType, providerName, providerResult, resultStatus, activeStatus, mobile } = req.body;

    // Check if the admin exists
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }
    const gameProviderInfo = await GameProvider.findOne({providerName});
    if(gameProviderInfo){
      return BadRequestResponse(res, HTTP_MESSAGE.THIS_GAME_ALLREADY_EXIST);
    }
    // Prepare game provider details
    const gameDetails = {
      gameType,
      providerName,
      providerResult,
      resultStatus,
      mobile,
      activeStatus
    };

    // Insert new game provider
    const newGameProvider = await insertQuery("GameProvider", gameDetails);
    return SuccessResponse(res, HTTP_MESSAGE.GAME_CREATED, { details: newGameProvider });

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

// Function for Update a game provider
const updateGameProvider = async (req, res) => {
  try {
    const { adminId, providerId, providerName, providerResult, resultStatus,activeStatus, mobile } = req.body;
    
    // Check if the admin exists
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    // Check if the game provider exists
    const gameProviderDetails = await findOne("GameProvider", { _id: providerId });
    if (!gameProviderDetails) {
      return NotFoundResponse(res, HTTP_MESSAGE.GAME_PROVIDER_NOT_FOUND);
    }

    //Update game provider object
    const option = {};
    if (providerName) {
      option.providerName = providerName
    };
    if (providerResult) {
      option.providerResult = providerResult
    };
    if (resultStatus) {
      option.resultStatus = resultStatus
    };
    if (mobile) {
      option.mobile = mobile
    };
    if (typeof activeStatus !== 'undefined') {
      option.activeStatus = activeStatus;
    };
  
    //Return the responce 
    const responce = await update("GameProvider", { _id: providerId }, option, "findOneAndUpdate", option);
    return SuccessResponse(res, HTTP_MESSAGE.GAME_PROVIDER_UPDATE, { details: responce })

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

// Function for deleting a game provider
const deleteGameProvider = async (req, res) => {
  try {
    const { adminId, gameProviderId } = req.body;

    // Check if the admin exists
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    // Check if the game provider exists
    const gameProviderDetails = await findOne("GameProvider", { _id: gameProviderId });
    if (!gameProviderDetails) {
      return NotFoundResponse(res, HTTP_MESSAGE.GAME_PROVIDER_NOT_FOUND);
    }

    // Delete the game provider
    await deleteQuery("GameProvider", { _id: gameProviderId }, "deleteOne");
    return SuccessResponse(res, HTTP_MESSAGE.GAME_PROVIDER_DELETED);

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

// Function for all Provider game 
const gameProviderList = async (req, res) => {
  try {
    const {adminId,gameType} = req.query;

    // Check if the admin exists
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    //Prepaire the Responce for Game Provider List
    const responce = await findAll("GameProvider", {gameType});
    return SuccessResponse(res, HTTP_MESSAGE.GAME_PROVIDER_DELETED, { details: responce });

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

// Function for all Provider game 
const gameProviderById = async (req, res) => {
  try {
    const gameProviderId = req.params.providerId;

    // Check if the game provider exists
    const gameProviderDetails = await findOne("GameProvider", { _id: gameProviderId });
    if (!gameProviderDetails) {
      return NotFoundResponse(res, HTTP_MESSAGE.GAME_PROVIDER_NOT_FOUND);
    }
    
    //Prepaire the Responce for Game Provider Info
    const responce = await findOne("GameProvider", { _id: gameProviderId });
    return SuccessResponse(res, HTTP_MESSAGE.PROVIDER_INFO, { details: responce });

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

export { addGameProvider, deleteGameProvider, updateGameProvider, gameProviderList, gameProviderById };
