import Joi from "joi";

export const addFundSchema = Joi.object({
  deviceId: Joi.number().required(),
  userId:Joi.string().required(),
  fullname:Joi.string().required(),
  username:Joi.string().required(),
  mobile:Joi.number().required(),
  amount:Joi.number().required()
});

export const addBankSchema = Joi.object({
  deviceId: Joi.number().required(),
  accNumber:Joi.number().required(),
  ifscCode:Joi.string().required(),
  bankName:Joi.string().required(),
  accName:Joi.string().required()
});

export const bankListSchema = Joi.object({
  deviceId: Joi.number().required()
});

export const updateBankDetailsSchema = Joi.object({
  deviceId: Joi.number().required(),
  accNumber:Joi.number().optional(),
  ifscCode:Joi.string().optional(),
  bankName:Joi.string().optional(),
  accName:Joi.string().optional()
});

export const withdrawFundSchema = Joi.object({
  deviceId: Joi.number().required(),
  accNumber:Joi.number().required(),
  ifscCode:Joi.string().required(),
  bankName:Joi.string().required(),
  accName:Joi.string().required(),
  userId:Joi.string().required(),
  reqAmount:Joi.string().required(),
  userName:Joi.string().required(),
  mobile:Joi.string().required(),
  withdrawalMode:Joi.string().required()
});

export const showUserWalletSchema = Joi.object({
  userId: Joi.string().required()
});


export const userFundRequestListSchema = Joi.object({
  userId: Joi.string().required()
});


