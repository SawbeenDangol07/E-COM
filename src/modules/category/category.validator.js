const joi = require("joi");
const { Status } = require("../../config/constant");
const CategoryDTO = joi.object({
  name: joi.string().min(2).max(40).required(),
  status: joi
    .string()
    .regex(/^(active|inactive)^/)
    .default(Status.INACTIVE),
  logo: joi.string().allow(null, "").optional().default(null),
});

module.exports = CategoryDTO;
