const joi = require("joi");
const { UserRoles } = require("../../config/constant");

const LoginDTO = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).max(25).required(),
});

const password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W@-_]).{8,25}^/;

const RegisterDTO = joi.object({
  name: joi.string().min(5).max(20).required(),
  email: joi.string().email().required(),
  password: joi.string().regex(password).required(),
  confirmPassword: joi.ref("password"),
  imaage: joi.string().allow(null, "").optional().default(null),
  role: joi
    .string()
    .regex(/^(customer|seller)^/)
    .default(UserRoles.CUSTOMER),
});

module.exports = {
  LoginDTO,
  RegisterDTO,
};
