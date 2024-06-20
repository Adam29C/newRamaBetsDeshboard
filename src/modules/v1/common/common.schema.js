import joi from "joi";

const generateAuthTokenSchema = joi.object({
    id: joi.string().optional(),
    deviceId: joi.string().optional(),
    role: joi.string().valid("USER", "ADMIN", "SUBADMIN").required(),
});
export { generateAuthTokenSchema }