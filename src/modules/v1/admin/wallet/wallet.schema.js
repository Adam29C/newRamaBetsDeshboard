<<<<<<< HEAD
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


=======
import Joi from "joi"
export const walletHestorySchema  = Joi.object({
    adminId: Joi.string().required(),
    // upiId:Joi.string().required(),
});



>>>>>>> 635e5638c446c80f203b14face44fce4a7ce24de
