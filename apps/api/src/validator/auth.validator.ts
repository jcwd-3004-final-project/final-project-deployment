// auth.validators.ts
import Joi from 'joi';

export const signUpValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phoneNumber: Joi.string().pattern(/^[0-9]+$/).required(),
  referralCode: Joi.string().optional().allow(''),
});

export const signInValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const refreshTokenValidator = Joi.object({
  refreshToken: Joi.string().required(),
});
