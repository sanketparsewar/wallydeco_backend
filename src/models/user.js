const { required } = require("joi");
const mongoose = require("mongoose");
// const { hashPassword } = require("./authentication");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    phone: { type: String },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
      default: "Male",
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dgcc3397p/image/upload/v1739263331/profile_picture3_bscksk.jpg",
    },
    refreshToken: {
      type: String,
    },
    favourite: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallpaper', // Replace 'Wallpaper' with the correct model if needed
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
