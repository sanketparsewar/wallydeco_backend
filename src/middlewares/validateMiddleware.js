const Joi = require("joi");

const validate = (schema) => {
    return (req, res, next) => {
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        return res.status(400).json({ message: "Validation error", errors: error.details[0].message });
      }
      next();
    };
  };
  
  module.exports = validate;
  
