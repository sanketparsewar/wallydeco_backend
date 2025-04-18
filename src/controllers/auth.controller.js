const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword, } = require("../service/hashAndComparePassword");
const { generateAccessToken } = require("../service/generateToken");

const generateToken = async (user) => {
  try {
    const accessToken = await generateAccessToken(user);
    return { accessToken };
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error generating tokens", error: err.message });
  }
};


// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address, gender, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      gender,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not Found." });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const { accessToken } = await generateToken(
      user
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password "
    );

    res
      .status(200)
      .json({
        message: "Logged in successfully",
        user: loggedInUser, accessToken: accessToken
      });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};






