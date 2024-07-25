import Joi from "joi";

export const revertPaymentSchema = Joi.object({
  adminId:Joi.string().required(),
  providerId: Joi.string().required(),
  gameResultId:Joi.string().required(),
  session:Joi.string().required(),
  resultDate:Joi.string().required(), 
  digit:Joi.number().required(),
  digitFamily:Joi.number().required(),
});

//adminId,gameResultId,providerId,session,digit,family,date

// export const deleteGameProviderSchema = Joi.object({
//   adminId:Joi.string().required(),
//   gameProviderId: Joi.string().required()
// });

// export const updateGameProviderSchema = Joi.object({
//   adminId:Joi.string().required(),
//   gameProviderId: Joi.string().required(),
//   providerName:Joi.string().optional(),
//   providerResult:Joi.string().optional(),
//   resultStatus:Joi.boolean().optional(),
//   activeStatus:Joi.boolean().optional(),
//   mobile:Joi.string().optional(),
// });

// export const gameProviderListSchema = Joi.object({
//   adminId:Joi.string().required()
// });

// export const gameProviderIdSchema = Joi.object({
//   providerId:Joi.string().required()
// });


