const Joi = require("joi");

const BannerDTO = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  url: Joi.string().uri().optional().default(null),
  status: Joi.string()
    .regex(/^(active|inactive)$/)
    .required(),
  image: Joi.string().allow(null, "").optional().default(null),
});

module.exports = {
  BannerDTO,
};
