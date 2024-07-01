import { findOne, insertQuery, deleteQuery } from '../../../../helpers/crudMongo.js';
import { HTTP_MESSAGE, InternalServerErrorResponse, SuccessResponse, BadRequestResponse, NotFoundResponse } from '../../../../helpers/http.js';

// Function For Add Game Provider API
const addGameProvider = async (req, res) => {
  try {
    const { adminId, providerName, providerResult, resultStatus, mobile } = req.body;

    // Check if the admin exists
    const adminDetails = await findOne("Admin", { _id: adminId });
    if (!adminDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    // Prepare game provider details
    const gameDetails = {
      providerName,
      providerResult,
      resultStatus,
      mobile
    };

    // Insert new game provider
    const newGameProvider = await insertQuery("GameProvider", gameDetails);
    return SuccessResponse(res, HTTP_MESSAGE.GAME_CREATED, { details: newGameProvider });

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

// Function For Delete Game Provider API
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

export { addGameProvider, deleteGameProvider };
