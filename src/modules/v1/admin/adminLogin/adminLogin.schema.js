import Joi from "joi";

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const adminProfileSchema = Joi.object({
  adminId: Joi.string().required(),
});

export const changePasswordSchema = Joi.object({
  adminId: Joi.string().required(),
  empId:Joi.string().required(),
  password:Joi.string().required()
});

export const createEmployeeSchema = Joi.object({
  adminId: Joi.string().required(),
  employeeName:Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  designation: Joi.string().required()
});

export const blockEmployeeSchema = Joi.object({
  adminId: Joi.string().required(),
  empId: Joi.string().required()
});

export const empListSchema = Joi.object({
  adminId: Joi.string().required(),
});

export const updateSystemInfoSchema = Joi.object({
  adminId: Joi.string().required(),
  title:Joi.string().required()
});

export const deleteEmployeeSchema = Joi.object({
  empId : Joi.string().required()
});

export const updateEmployeeInformitionSchema = Joi.object({
  adminId : Joi.string().required(),
  empId : Joi.string().required(),
  username : Joi.string().required(),
  permission : Joi.object().required()
});
//adminId,empId,username,permission 