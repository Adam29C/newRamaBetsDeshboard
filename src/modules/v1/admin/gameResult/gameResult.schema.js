import Joi from "joi";

export const addGameResultSchema = Joi.object({
  session:Joi.string().required(),
  adminId:Joi.string().required(),
  providerId:Joi.string().required(),
  resultDate: Joi.string().required(),
  winningDigit:Joi.number().required()
});

export const getGameResultSchema = Joi.object({
  adminId:Joi.string().required(),
});

export const deleteGameRateSchema = Joi.object({
  adminId:Joi.string().required(),
  gameResultId:Joi.string().required()
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


