const Joi = require("joi");
const { Status } = require("../../config/constant");

const CategoryDataDTO = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  status: Joi.string()
    .regex(/^(active|inactive)$/)
    .default(Status.INACTIVE),
  parent: Joi.string().allow(null, "").optional().default(null),
  brands: Joi.array()
    .items(Joi.string().allow(null, "").optional().default(null))
    .allow(null, "")
    .default(null),
  image: Joi.string().allow(null, "").optional().default(null),
});

module.exports = {
  CategoryDataDTO,
};
