import Joi from "joi";

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const adminProfileSchema = Joi.object({
  adminId: Joi.string().required(),
});

export const changePasswordSchema = Joi.object({
  id: Joi.string().required(),
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
  empId: Joi.string().required(),
  isBlock:Joi.boolean().required()
});

export const empListSchema = Joi.object({
  adminId: Joi.string().required(),
});

export const updateSystemInfoSchema = Joi.object({
  adminId: Joi.string().required(),
  title:Joi.string().required()
});

export const deleteEmployeeSchema = Joi.object({
  empId : Joi.string().required(),
  adminId: Joi.string().required(),

});

export const updateEmployeeInformitionSchema = Joi.object({
  adminId : Joi.string().required(),
  empId : Joi.string().required(),
  employeeName:Joi.string().required(),
  username : Joi.string().optional(),
  loginPermission:Joi.number().required(),
  permission : Joi.object().optional(),
  
});

export const commonSchema = Joi.object({
  id : Joi.string().required(),
});

export const updateGameStatusSchema = Joi.object({
  adminId:Joi.string().required(),
  id : Joi.string().required(),
  gameType:Joi.string().required(),
  activeStatus:Joi.boolean().required()
});

export const updateVersionSettingSchema = Joi.object({
  adminId:Joi.string().required(),
  versionId : Joi.string().required(),
  appVersion:Joi.number().required(),
  apkFileName:Joi.string().optional(),
  forceUpdate:Joi.boolean().optional(),
  maintainence:Joi.boolean().required()
});

export const listVersionSettingSchema = Joi.object({
  adminId:Joi.string().required()
});

// 