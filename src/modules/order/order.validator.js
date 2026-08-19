const Joi = require("joi");

const ProductDTO = Joi.object({
  product: Joi.string().required(),
  quantity: Joi.number().min(1).max(10).required(),
});
const UpdateCartDTO = Joi.object({
  product: Joi.string().required(),
  quantity: Joi.number().min(0).required(),
});

const CheckoutDTO = Joi.object({
  cartId: Joi.string().required(),
  discount: Joi.number().min(0).max(100).optional().default(0),
});

const PaymentDTO = Joi.object({
  orderId: Joi.string().required(),
  method: Joi.string()
    .regex(/^(khalti|cod)$/)
    .default("cod"),
});

module.exports = {
  ProductDTO,
  UpdateCartDTO,
  CheckoutDTO,
  PaymentDTO,
};
