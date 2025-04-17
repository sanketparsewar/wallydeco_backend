const User = require("../models/user");
const jwt = require("jsonwebtoken");
const {  hashPassword,  comparePassword,} = require("../service/hashAndComparePassword");
const {  generateAccessToken,  generateRefreshToken} = require("../service/generateToken");

const generateAccessAndRefreshToken = async ( user) => {
  try {
    const accessToken = await generateAccessToken( user);
    const refreshToken = await generateRefreshToken( user);
     user.refreshToken = refreshToken;
    await  user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
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
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken "
    );

    // set cookies options
    const options = {
      httpOnly: false,
      secure: true,
    };
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Logged in successfully",
        user: loggedInUser,accessToken:accessToken
      });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};



exports.logout = async (req, res) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Token is not provided" });
    }
    // const decode = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    const decode = jwt.decode(token);
    await User.findByIdAndUpdate(
      decode._id,
      { $unset: { refreshToken: "" } },
      { new: true }
    );

    const options = {
      httpOnly: false,
      secure: true,
    };
    res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error logging out", error: err.message });
  }
};


exports.refreshAccessToken = async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;
  if (!incomingRefreshToken) {
    return res.status(400).json({ message: "No refresh token provided" });
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );
    const user = await User.findById(decodedToken._id);

    if (incomingRefreshToken !== user?.refreshToken) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user
    );

    // update refreshToken in database

    const options = {
      httpOnly: false,
      secure: true,
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Access token refreshed successfully"
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






