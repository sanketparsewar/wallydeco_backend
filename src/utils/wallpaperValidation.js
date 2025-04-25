const Joi = require("joi");

// Joi schema for creating a new wallpaper
exports.WallpaperValidation = Joi.object({
  wallpaperId: Joi.string().min(2).max(100).required().messages({
    "string.empty": "WallpaperId is required.",
    "string.min": "WallpaperId must be at least 2 characters long.",
    "string.max": "WallpaperId cannot exceed 100 characters.",
    "any.required": "WallpaperId is required.",
  }),
  title: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Title is required.",
    "string.min": "Title must be at least 2 characters long.",
    "string.max": "Title cannot exceed 100 characters.",
    "any.required": "Title is required.",
  }),
  description: Joi.string().max(500).allow("").messages({
    "string.max": "Description cannot exceed 500 characters.",
  }),
  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a valid number.",
    "number.min": "Price cannot be negative.",
    "any.required": "Price is required.",
  }),
  category: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Category is required.",
    "string.min": "Category must be at least 3 characters long.",
    "string.max": "Category cannot exceed 50 characters.",
    "any.required": "Category is required.",
  }),
  size: Joi.string().min(1).max(50).required().messages({
    "string.empty": "Size is required.",
    "string.min": "Size must be at least 1 character long.",
    "string.max": "Size cannot exceed 50 characters.",
    "any.required": "Size is required.",
  }),
  colorOptions: Joi.array().items(Joi.string().max(30)).messages({
    "array.base": "Color options must be an array of strings.",
    "string.max": "Each color option cannot exceed 30 characters.",
  }),
  stock: Joi.number().min(0).default(0).messages({
    "number.base": "Stock must be a valid number.",
    "number.min": "Stock cannot be negative.",
  }),
  images: Joi.array().items(Joi.string().uri()).messages({
    "array.base": "Images must be an array of valid URLs.",
    "string.uri": "Each image must be a valid URL.",
  }),
  _id: Joi.string().optional(),
  createdAt: Joi.string().optional(),
  updatedAt: Joi.string().optional(),
  sold: Joi.number().optional(),

});

// Joi schema for updating a wallpaper (Partial Validation)



