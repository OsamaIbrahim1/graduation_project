import Joi from "joi";
import { generalRules } from "../../utils/general.validation.rule.js";

export const signUpSchema = {
  body: Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().required().email().trim().lowercase(),
    password: Joi.string().required().min(6),
    phoneNumber: Joi.string().required().pattern(new RegExp("^[0-9]{11}$")),
    Birthday: Joi.date().iso().required(),
  }),
};

export const signInSchema = {
  body: Joi.object({
    email: Joi.string().required().email().trim().lowercase(),
    password: Joi.string().required().min(6),
  }),
};

export const updateUserSchema = {
  body: Joi.object({
    name: Joi.string().min(3),
    email: Joi.string().email().trim().lowercase(),
    phoneNumber: Joi.string().pattern(new RegExp("^[0-9]{11}$")),
    Birthday: Joi.date().iso(),
    oldPublicId: Joi.string(),
  }),
  headers: generalRules.headersRules,
};

export const deleteUserSchema = {
  headers: generalRules.headersRules,
};

export const getUserDataSchema = {
  headers: generalRules.headersRules,
};

export const uploadImageUserSchema = {
  headers: generalRules.headersRules,
};

export const forgetPasswordSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};

export const resetPasswordAfterOTPSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
    newPassword: Joi.string().min(6).max(15).required(),
  }),
};
export const updatePasswordSchema = {
  body: Joi.object({
    oldPassword: Joi.string().required().min(6),
    newPassword: Joi.string().required().min(6),
    confirmPassword:Joi.string().required().min(6)
  }).with('newPassword', 'confirmPassword'),
  headers: generalRules.headersRules,
};
