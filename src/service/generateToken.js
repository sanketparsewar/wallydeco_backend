const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.generateAccessToken = async (employee) => {
  return jwt.sign(
    {
      _id: employee._id,
    },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

exports.generateRefreshToken = async (employee) => {
  return jwt.sign({ _id: employee._id }, process.env.REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};
