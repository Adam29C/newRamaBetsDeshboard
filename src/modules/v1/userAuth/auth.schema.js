import Joi from "joi";

export const resendOtpSchema = Joi.object({
  userId: Joi.string().required(),
});

export const userLogoutSchema = Joi.object({
  userId: Joi.string().required(),
});
