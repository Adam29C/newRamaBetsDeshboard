import Joi from "joi";

export const gameSchema = Joi.object({
  userId:Joi.string().required(),
});

export const gameByIdSchema = Joi.object({
  userId:Joi.string().required(),
  gameType:Joi.string().required(),
  gameId:Joi.string().required()
});

export const gamesRatesByIdSchema = Joi.object({
  userId:Joi.string().required(),
  gameType:Joi.string().required(),
  gameRateId:Joi.string().required()
});

export const gameListSchema = Joi.object({
  userId:Joi.string().required()
});
