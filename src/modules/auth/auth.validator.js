const joi = require("joi");
const { UserRoles } = require("../../config/constant");

const LoginDTO = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).max(25).required(),
});

const password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,25}$/;

const RegisterDTO = joi.object({
  name: joi.string().min(2).max(50).required(),
  email: joi.string().email().required(),
  password: joi.string().regex(password).required(),
  confirmPassword: joi.string().valid(joi.ref("password")).required().messages({
    "any.only": "Confirm password does not match password",
  }),
  image: joi.string().allow(null, "").optional().default(null),
  role: joi
    .string()
    .valid(...Object.values(UserRoles))
    .default(UserRoles.CUSTOMER),
});

module.exports = {
  LoginDTO,
  RegisterDTO,
};
