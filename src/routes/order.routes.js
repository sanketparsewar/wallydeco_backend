const express = require("express");
const router = express.Router();
const { placeOrder, getAllOrders, getOrderById, updateOrderStatus, deleteOrder } = require("../controllers/order.controller");
const { verifyJwt } = require("../middlewares/auth.middleware");

router.post("/", verifyJwt, placeOrder); // Create a new order
router.get("/", getAllOrders); // Get all orders
router.get("/:id", getOrderById); // Get order by ID
// router.put("/:id", updateOrderStatus); // Update order status
router.delete("/:id", deleteOrder); // Delete an order

module.exports = router;
