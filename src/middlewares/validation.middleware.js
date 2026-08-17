const joi = require("joi");

const bodyValidator = (schema) => {
  return async (req, res, next) => {
    try {
      const data = req.body;
      if (!data) {
        throw {
          code: 422,
          message: "Data required",
          status: "EMPTY_PAYLOAD_ERR",
        };
      }

      let result = await schema.validateAsync(data, {
        abortEarly: false,
      });

      req.body = result;
      next();
    } catch (exception) {
      let messageBag = {};
      if (exception instanceof joi.ValidationError) {
        exception.details.forEach((error) => {
          messageBag[error.path[0]] = error.message;
        });
        return next({
          code: 400,
          message: "VALIDATION_FAILED",
          status: "VALIDATION_ERR",
          detail: messageBag,
        });
      }

      next(exception);
    }
  };
};

module.exports = bodyValidator;

