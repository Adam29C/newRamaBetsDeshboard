import joi from "joi";
const generateAuthTokenSchema = joi.object({
    id: joi.string().optional(),
    deviceId: joi.string().optional(),
    mpin: joi.string().optional(),
    firebaseToken:joi.string().optional()
});
export { generateAuthTokenSchema }