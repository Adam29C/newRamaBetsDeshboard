import { findOne, insertQuery, deleteQuery, update, findAll } from '../../../../helpers/crudMongo.js';
import { HTTP_MESSAGE, InternalServerErrorResponse, SuccessResponse, BadRequestResponse, NotFoundResponse } from '../../../../helpers/http.js';
import Admin from '../../../../models/admin.js';
import { GameRate } from '../../../../models/gameRates.js';

// Function for adding a game rate
const addGameRate = async (req, res) => {
  try {
    const { adminId, gameName, gamePrice } = req.body;

    // Check if the admin exists
    const adminDetails = await findOne('Admin', { _id: adminId });
    if (!adminDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    // Prepare game rate details
    const gameRateDetails = {
      gameName,
      gamePrice
    };

    // Insert new game rate
    const newGameRate = await insertQuery('GameRate', gameRateDetails);
    return SuccessResponse(res, HTTP_MESSAGE.GAME_RATE_CREATED, { details: newGameRate });

  } catch (err) {
    console.error('Error in addGameRate:', err);
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

// Function for updating a game rate
const updateGameRate = async (req, res) => {
  try {
    const { adminId, gameRateId, gameName, gamePrice } = req.body;

    // Check if the admin exists
    const adminDetails = await findOne('Admin', { _id: adminId });
    if (!adminDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    // Check if the game rate exists
    const gameRateDetails = await findOne('GameRate', { _id: gameRateId });
    if (!gameRateDetails) {
      return NotFoundResponse(res, HTTP_MESSAGE.GAME_RATE_NOT_FOUND);
    }

    // Prepare fields to be updated
    const updateFields = {};
    if (gameName !== undefined) updateFields.gameName = gameName;
    if (gamePrice !== undefined) updateFields.gamePrice = gamePrice;

    // Perform the update
    const updatedGameRate = await updateQuery('GameRate', { _id: gameRateId }, updateFields, { new: true });

    return SuccessResponse(res, HTTP_MESSAGE.GAME_RATE_UPDATE, { details: updatedGameRate });

  } catch (err) {
    console.log(err.message,"test")
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

// Function for deleting a game rate
const deleteGameRate = async (req, res) => {
  try {
    const { adminId, gameRateId } = req.body;

    // Check if the admin exists
    const adminDetails = await findOne('Admin', { _id: adminId });
    if (!adminDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    // Check if the game rate exists
    const gameRateDetails = await findOne('GameRate', { _id: gameRateId });
    if (!gameRateDetails) {
      return NotFoundResponse(res, HTTP_MESSAGE.GAME_RATE_NOT_FOUND);
    }

    // Delete the game rate
    await deleteQuery('GameRate', { _id: gameRateId });
    return SuccessResponse(res, HTTP_MESSAGE.GAME_RATE_DELETED);

  } catch (err) {
    ;
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

// Function for listing all game rates
const gameRateList = async (req, res) => {
  try {
    const { adminId } = req.query;

    // Check if the admin exists
    const adminDetails = await findOne('Admin', { _id: adminId });
    if (!adminDetails) {
      return BadRequestResponse(res, HTTP_MESSAGE.USER_NOT_FOUND);
    }

    // Fetch all game rates
    const gameRates = await findAll('GameRate', {});
    return SuccessResponse(res, HTTP_MESSAGE.GAME_RATE_LIST, gameRates);

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

// Function for retrieving game rate by ID
const gameRateById = async (req, res) => {
  try {
    const { gameRateId } = req.params;

    // Check if the game rate exists
    const gameRateDetails = await findOne('GameRate', { _id: gameRateId });
    if (!gameRateDetails) {
      return NotFoundResponse(res, HTTP_MESSAGE.GAME_RATE_NOT_FOUND);
    }

    // Prepare the response for game rate info
    return SuccessResponse(res, HTTP_MESSAGE.GAME_RATE_DETAILS, gameRateDetails);

  } catch (err) {
    return InternalServerErrorResponse(res, HTTP_MESSAGE.INTERNAL_SERVER_ERROR, err);
  }
};

export { addGameRate, updateGameRate, deleteGameRate, gameRateList, gameRateById };
