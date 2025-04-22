const express = require("express");
require("dotenv").config();
const connectDB = require("./database/configdb");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

// Routes
const authRoutes = require("./routes/auth.routes");
const categoryRoutes = require("./routes/category.routes");
const wallpaperRoutes = require("./routes/wallpaper.routes");
const couponRoutes = require("./routes/coupon.routes");
const userRoutes = require("./routes/user.routes");
const orderRoutes = require("./routes/order.routes");
const cloudinaryRoutes = require("./routes/cloudinary.routes");


connectDB
  .then(() => console.log("MongoDB connection successful"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://wallydeconew.vercel.app", "http://localhost:4200"], // Allow Angular frontend (local + live)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
    // allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow cookies & authentication headers
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/wallpaper", wallpaperRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/user", userRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/upload", cloudinaryRoutes);

module.exports = app;
