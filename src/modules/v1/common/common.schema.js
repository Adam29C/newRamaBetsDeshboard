import joi from "joi";
const generateAuthTokenSchema = joi.object({
    id: joi.string().optional(),
    deviceId: joi.string().optional(),
});
export { generateAuthTokenSchema }