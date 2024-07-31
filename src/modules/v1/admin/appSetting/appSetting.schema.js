import Joi from "joi";

export const listVersionSettingSchema = Joi.object({
    adminId: Joi.string().required()
});

export const updateWalledContestSchema = Joi.object({
    adminId: Joi.string().required(),
    walledId: Joi.string().required(),
    number: Joi.number().optional(),
    headline: Joi.string().optional(),
    upiId: Joi.string().optional(),
});
