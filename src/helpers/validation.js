import joi from "joi";
const loginValidation = data =>{
    const schema = {
        username: joi.string().min(5).required(),
        password: joi.string().min(5).required(),
        deviceId: joi.string().min(2).required()
    };
    return joi.validate(data, schema);
};