import Joi from "joi";

export const gameSettingSchema = Joi.object({
  gameType:Joi.string().required(),
  adminId:Joi.string().required(),
  providerId: Joi.string().required(),
  gameDay:Joi.string().required(),
  OBT:Joi.string().required(),
  CBT:Joi.string().required(),
  OBRT:Joi.string().required(),
  CBRT:Joi.string().required(),
  isClosed:Joi.string().required()
});

export const deleteGameSettingSchema = Joi.object({
  adminId:Joi.string().required(),
  gameSettingId: Joi.string().required()
});

export const updateGameSettingSchema = Joi.object({
  adminId:Joi.string().required(),
  providerId:Joi.string().required(),
  gameSettingId: Joi.string().optional(),
  gameDay:Joi.string().optional(),
  OBT:Joi.string().optional(),
  CBT:Joi.string().optional(),
  OBRT:Joi.string().optional(),
  CBRT:Joi.string().optional(),
  isClosed:Joi.string().optional(),
});

export const gameProviderListSchema = Joi.object({
  adminId:Joi.string().required()
});

export const gameProviderIdSchema = Joi.object({
  gameSettingId:Joi.string().required()
});


