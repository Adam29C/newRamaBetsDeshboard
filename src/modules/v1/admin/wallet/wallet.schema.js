import Joi from "joi";

export const userListSchema = Joi.object({
  adminId: Joi.string().required(),
  
});

export const blockUserSchema = Joi.object({
  adminId: Joi.string().required(),
  userId: Joi.string().required(),
  isBlock:Joi.boolean().required()
})

export const deleteUserSchema = Joi.object({
  adminId: Joi.string().required(),
  userId:Joi.string().required(),
  reason:Joi.string().required()
});

export const userIdiaSchema = Joi.object({
  adminId: Joi.string().required(),
});


