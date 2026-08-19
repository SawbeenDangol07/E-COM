const joi = require("joi");
const { Status } = require("../../config/constant");

const ProductDTO = joi.object({
  name: joi.string().min(2).max(200).required(),
  price: joi.number().min(1).required(),
  discount: joi.number().min(0).max(90).default(0),
  description: joi.string().min(10).required(),
  brand: joi.string().optional().allow(null, " ").default(null),
  category: joi.array().items(joi.string()).required(),
  stock: joi.number().min(0).optional().allow(null, "").default(0),
  sku: joi.string().optional().allow(null, "").default(null),
  attributes: joi.array().items(
    joi.object({
      key: joi.string(),
      value: joi.array().items(joi.string()),
    }),
  ),
  seller: joi.string().optional().allow(null, "").default(null),
  status: joi
    .string()
    .regex(/^(active|inactive)$/)
    .default(Status.INACTIVE),
  images: joi.string().optional().allow(null, "").default(null),
});

module.exports = {
  ProductDTO,
};
