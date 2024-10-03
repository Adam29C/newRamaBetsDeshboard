import Joi from "joi"
export const walletHestorySchema  = Joi.object({
    adminId: Joi.string().required(),
    // upiId:Joi.string().required(),
});



