const express = require("express");
const router = express.Router();
const { placeOrder,getUserOrders, getAllOrders, getOrderById,cancelOrder,markAsDelivered, updateOrderStatus, deleteOrder } = require("../controllers/order.controller");
const { verifyJwt } = require("../middlewares/auth.middleware");

router.post("/", verifyJwt, placeOrder);
router.get("/user",verifyJwt, getUserOrders);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.put('/:orderId/cancel', cancelOrder);
router.put('/:orderId/delivered',markAsDelivered);
router.put("/:id", updateOrderStatus);
router.delete("/:id", deleteOrder);

module.exports = router;
