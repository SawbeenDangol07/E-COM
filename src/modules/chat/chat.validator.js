const Joi = require("joi");

const SendChatDTO = Joi.object({
  receiver: Joi.string().required(),
  message: Joi.string().min(1).max(5000).required(),
});

module.exports = {
  SendChatDTO,
};
