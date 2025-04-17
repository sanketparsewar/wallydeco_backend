const Joi = require("joi");

// Validation schema for user registration
exports.registerValidation = Joi.object({
  name: Joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.empty": "Name is required.",
      "string.min": "Name must be at least 3 characters long.",
      "string.max": "Name cannot exceed 50 characters.",
      "string.pattern.base": "Name can only contain letters and spaces.",
    }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format.",
    "string.empty": "Email is required.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "string.empty": "Password is required.",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .messages({
      "string.pattern.base": "Phone number must be exactly 10 digits.",
    }),
  address: Joi.object({
    street: Joi.string().required().messages({
      "string.empty": "Street is required.",
    }),
    city: Joi.string().required().messages({
      "string.empty": "City is required.",
    }),
    state: Joi.string().required().messages({
      "string.empty": "State is required.",
    }),
    zip: Joi.string()
      .pattern(/^[0-9]{5,6}$/)
      .required()
      .messages({
        "string.pattern.base": "ZIP code must be 5 or 6 digits.",
        "string.empty": "ZIP code is required.",
      }),
  }).required(),
  gender: Joi.string()
    .valid("Male", "Female", "Other")
    .default("Male")
    .required(),
  role: Joi.string().valid("admin", "user").default("user"),
}).messages({
  "any.required": "All required fields must be provided.",
});

// Validation schema for user login


// Validation schema for updating user profile
exports.updateUserValidation = Joi.object({
  name: Joi.string().min(3).max(50).optional().messages({
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name cannot exceed 50 characters.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format.",
    "string.empty": "Email is required.",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .messages({
      "string.pattern.base": "Phone number must be exactly 10 digits.",
    }),
  address: Joi.object({
    street: Joi.string().optional().messages({
      "string.empty": "Street cannot be empty.",
    }),
    city: Joi.string().optional().messages({
      "string.empty": "City cannot be empty.",
    }),
    state: Joi.string().optional().messages({
      "string.empty": "State cannot be empty.",
    }),
    zip: Joi.string()
      .pattern(/^[0-9]{5,6}$/)
      .optional()
      .messages({
        "string.pattern.base": "ZIP code must be 5 or 6 digits.",
      }),
  }).optional(),
  gender: Joi.string().valid("Male", "Female", "Other").optional(),
  image: Joi.string().optional(),
}).messages({
  "any.only": "Invalid input for gender.",
});


