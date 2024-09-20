import Joi from "joi";

export const getOtpSchema = Joi.object({
  mobile: Joi.number().required(),
  deviceId:Joi.string().required()
});

export const verifySchema = Joi.object({
  deviceId:Joi.string().required(),
  otp:Joi.number().required()
});

export const signupSchema = Joi.object({
  deviceId: Joi.string().required(),
  name:Joi.string().required(),
  language:Joi.string().required(),
  city:Joi.string().required(),
  state:Joi.string().required()
});

export const setMpinSchema = Joi.object({
  deviceId: Joi.string().required(),
  mpin:Joi.string().required(),
});

export const userPrfileSchema = Joi.object({
  userId:Joi.string().required()
});

export const htpSchema = Joi.object({
  userId:Joi.string().required()
});

export const gamesSchema = Joi.object({
  userId:Joi.string().required(),
  gameType:Joi.string().required()
});

export const upadateUserPrfileSchema = Joi.object({
  userId:Joi.string().required(),
  name:Joi.string().optional(),
  language:Joi.string().optional(),
  city:Joi.string().optional()
});

export const checkUserSchema = Joi.object({
  deviceId:Joi.string().required(),
});