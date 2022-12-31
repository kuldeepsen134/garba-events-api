const Joi = require('joi')

const registerValidation = Joi.object().keys({
  first_name: Joi.string().required().empty(''),
  last_name: Joi.string().required().empty(''),
  email: Joi.string().email().required().empty(''),
  password: Joi.string().min(6).required().empty(''),
  gender:Joi.string().required().empty(''),
})

const loginValidation = Joi.object().keys({
  email: Joi.string().email().required().empty(''),
  password: Joi.string().required().empty(''),
})

const forgotPasswordValidation = Joi.object().keys({
  email: Joi.string().email().required().empty(''),
})

const forgotPasswordVerifyValidation = Joi.object().keys({
  token: Joi.string().required().empty(''),
  new_password: Joi.string().min(6).required().empty(''),
  confirm_password: Joi.string().min(6).required().empty(''),
})

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  forgotPasswordVerifyValidation
}
