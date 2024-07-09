import Joi from "joi";

export const addGameResultSchema = Joi.object({
  adminId:Joi.string().required(),
  providerId:Joi.string().required(),
  resultdate: Joi.string().required(),
  winningDigit:Joi.number().required()
});

//adminId,providerId,resultdate,winningDigit

// export const deleteGameRateSchema = Joi.object({
//   adminId:Joi.string().required(),
//   gameRateId: Joi.string().required()
// });

// export const updateGameReteSchema = Joi.object({
//   adminId:Joi.string().required(),
//   gameRateId: Joi.string().required(),
//   gameName:Joi.string().optional(),
//   gamePrice:Joi.number().optional()
// });

// export const gameRateListSchema = Joi.object({
//   adminId:Joi.string().required()
// });

// export const gameReteByIdSchema = Joi.object({
//   gameRateId:Joi.string().required()
// });

