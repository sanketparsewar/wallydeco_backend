// const express = require("express");
// require("dotenv").config();
// const connectDB = require("./database/configdb");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const app = express();
// const socketIo = require("socket.io");
// const http = require("http");

// // Routes
// const authRoutes = require("./routes/auth.routes");
// const categoryRoutes = require("./routes/category.routes");
// const cityRoutes = require("./routes/city.routes");
// const wallpaperRoutes = require("./routes/wallpaper.routes");
// const couponRoutes = require("./routes/coupon.routes");
// const userRoutes = require("./routes/user.routes");
// const orderRoutes = require("./routes/order.routes");
// const dashboardRoutes = require("./routes/dashboard.routes");
// const cloudinaryRoutes = require("./routes/cloudinary.routes");


// connectDB
//   .then(() => console.log("MongoDB connection successful"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Socket.io setup
// const server = http.createServer(app);
// const io = socketIo(server, {
//   // cors: {
//   //   origin: ["https://wallydeconew.vercel.app", "http://localhost:4200"], // Allow Angular frontend (local + live)
//   //   methods: ["GET", "POST"],
//   //   credentials: true,
//   // },
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST", "PUT"],
//   },
//   transports: ["websocket", "polling"],
// });

// io.on("connection", (socket) => {
//   console.log("New client connected");
//   socket.on("placeOrder", () => {
//     io.emit("orderPlaced"); // Notifying all clients (interviewer)
//   });
//   socket.on('updateOrderStatus', () => {
//     io.emit('orderStatusUpdated'); // Notifying all clients (interviewer)
//   }
//   );
// })



// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: ["https://wallydeconew.vercel.app", "http://localhost:4200"], // Allow Angular frontend (local + live)
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
//     // allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
//     credentials: true, // Allow cookies & authentication headers
//   })
// );

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/category", categoryRoutes);
// app.use("/api/city", cityRoutes);
// app.use("/api/wallpaper", wallpaperRoutes);
// app.use("/api/coupon", couponRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/order", orderRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/upload", cloudinaryRoutes);

// module.exports = app;







const express = require("express");
require("dotenv").config();
const connectDB = require("./database/configdb");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

// Express App Initialization
const app = express();
const server = http.createServer(app); // Attach server to app

// Socket.IO Setup
const io = socketIo(server, {
  cors: {
    origin: ["https://wallydeconew.vercel.app", "http://localhost:4200"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// MongoDB Connection
connectDB.then(() => console.log("MongoDB connection successful"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://wallydeconew.vercel.app", "http://localhost:4200"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/category", require("./routes/category.routes"));
app.use("/api/city", require("./routes/city.routes"));
app.use("/api/wallpaper", require("./routes/wallpaper.routes"));
app.use("/api/coupon", require("./routes/coupon.routes"));
app.use("/api/user", require("./routes/user.routes"));
app.use("/api/order", require("./routes/order.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.use("/api/upload", require("./routes/cloudinary.routes"));

// Socket.IO Events
io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("placeOrder", () => {
    console.log('orderplaced')
    io.emit("receiveOrder");
  });

  socket.on("updateOrderStatus", () => {
    io.emit("orderStatusUpdated");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Export server for nodemon or manual execution
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
