import Joi from "joi"

export const upiListSchema = Joi.object({
    adminId: Joi.string().required()   
});

export const addUpiSchema = Joi.object({
    adminId: Joi.string().required(),
    upiName:Joi.string().required()  
});

export const updateUpiStatusSchema = Joi.object({
    adminId: Joi.string().required(),
    upiId:Joi.string().required(),
    status:Joi.string().optional(),
});

export const deleteUpiSchema  = Joi.object({
    adminId: Joi.string().required(),
    upiId:Joi.string().required(),
});



