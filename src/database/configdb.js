const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = mongoose.connect(process.env.MONGODB_URI);

module.exports = connectDB;
