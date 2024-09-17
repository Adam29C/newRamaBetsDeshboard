import Joi from "joi";

export const gameSchema = Joi.object({
  userId:Joi.string().required(),
  gameType:Joi.string().required()
});
