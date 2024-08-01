import Joi from "joi";

export const addGameReteSchema = Joi.object({
  gameType:Joi.string().required(),
  adminId:Joi.string().required(),
  gameName: Joi.string().required(),
  gamePrice:Joi.number().required()
});

export const deleteGameRateSchema = Joi.object({
  adminId:Joi.string().required(),
  gameRateId: Joi.string().required()
});

export const updateGameReteSchema = Joi.object({
  adminId:Joi.string().required(),
  gameRateId: Joi.string().required(),
  gameName:Joi.string().optional(),
  gamePrice:Joi.number().optional()
});

export const gameRateListSchema = Joi.object({
  adminId:Joi.string().required(),
  gameType:Joi.string().required(),
});

export const gameReteByIdSchema = Joi.object({
  gameRateId:Joi.string().required()
});


