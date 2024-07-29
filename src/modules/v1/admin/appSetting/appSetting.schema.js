import Joi from "joi";

export const listVersionSettingSchema = Joi.object({
    adminId: Joi.string().required()
});
