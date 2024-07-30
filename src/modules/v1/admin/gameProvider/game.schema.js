import Joi from "joi";

export const gameSchema = Joi.object({
  gameType:Joi.string().required(),
  adminId:Joi.string().required(),
  providerName: Joi.string().required(),
  providerResult:Joi.string().required(),
  activeStatus:Joi.boolean().required(),
  mobile:Joi.string().required(),
  resultStatus:Joi.number().required()
});

export const deleteGameProviderSchema = Joi.object({
  adminId:Joi.string().required(),
  gameProviderId: Joi.string().required()
});

export const updateGameProviderSchema = Joi.object({
  adminId:Joi.string().required(),
  gameType:Joi.string().optional(),
  providerId: Joi.string().required(),
  providerName:Joi.string().optional(),
  providerResult:Joi.string().optional(),
  resultStatus:Joi.boolean().optional(),
  activeStatus:Joi.boolean().optional(),
  mobile:Joi.string().optional(),
});

export const gameProviderListSchema = Joi.object({
  adminId:Joi.string().required(),
  gameType:Joi.string().required()
});

export const gameProviderIdSchema = Joi.object({
  providerId:Joi.string().required()
});


