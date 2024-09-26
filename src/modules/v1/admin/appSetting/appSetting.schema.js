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
    mobileNumber:Joi.number().optional()
});

export const updateNoticeBoardSchema = Joi.object({
    adminId: Joi.string().required(),
    noticeId: Joi.string().required(),
    title1: Joi.string().optional(),
    title2: Joi.string().optional(),
    title3: Joi.string().optional(),
    description1: Joi.string().optional(),
    description2: Joi.string().optional(),
    description3: Joi.string().optional(),
    contact: Joi.number().optional()
});
