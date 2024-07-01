import { findOne, insertQuery, deleteQuery, update, findAll } from '../../../../helpers/crudMongo.js';
import { HTTP_MESSAGE, InternalServerErrorResponse, SuccessResponse, BadRequestResponse, NotFoundResponse } from '../../../../helpers/http.js';
import GameProvider from '../../../../models/GameProvider.js'; // Ensure this matches the actual file name casing

// Function for adding a game provider
const addGameProvider = async (req, res) => {
  try {
    const { adminId, game, providerName, providerResult, resultStatus, activeStatus, mobile } = req.body;


    // Check if the admin exists
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    // Prepare game provider details
    const gameDetails = {
      game,
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
    const { adminId, gameProviderId, providerName, providerResult, resultStatus, mobile } = req.body;

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
    }

    //Return the responce 
    const responce = await update("GameProvider", { _id: gameProviderId }, option, "findOneAndUpdate", option);
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
    console.log("Error deleting game provider:", err);
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

// Function for all Provider game 
const gameProviderList = async (req, res) => {
  try {
    const adminId = req.params.adminId;

    // Check if the admin exists
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    //Prepaire the Responce for Game Provider List
    const responce = await findAll("GameProvider", {});
    return SuccessResponse(res, HTTP_MESSAGE.GAME_PROVIDER_DELETED, { details: responce });

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

// Function for all Provider game 
const gameProviderById = async (req, res) => {
  try {
    const gameProviderId = req.params.gameProviderId;

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
