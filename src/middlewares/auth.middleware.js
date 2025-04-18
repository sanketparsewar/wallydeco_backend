const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

exports.verifyJwt = async (req, res, next) => {
  try {
    const token =
      req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res.status(400).json({ message: "Token is not provided" });
    }
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    const user = await User.findById(decode?._id).select(
      "-password"
    );
    if (!user) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
