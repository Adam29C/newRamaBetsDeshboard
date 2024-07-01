import Joi from "joi";

export const gameSchema = Joi.object({
  providerName: Joi.string().required(),
  providerResult:Joi.string().required(),
  mobile:Joi.number().required(),
  resultStatus:Joi.number().required()
});
