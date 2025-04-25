const express = require("express");
const router = express.Router();
const { placeOrder, getUserOrders, markAsShipped, getAllOrders, getOrderById, cancelOrder, markAsDelivered, updateOrderStatus, deleteOrder } = require("../controllers/order.controller");
const { verifyJwt } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

router.post("/", verifyJwt, placeOrder);
router.get("/user", verifyJwt, getUserOrders);
router.get("/", verifyJwt, isAdmin, getAllOrders);
router.get("/:id", getOrderById);
router.put('/:orderId/cancel', cancelOrder);
router.put('/:orderId/ship', verifyJwt, isAdmin, markAsShipped);
router.put('/:orderId/deliver', verifyJwt, isAdmin, markAsDelivered);
router.put('/:orderId/update', verifyJwt, isAdmin, updateOrderStatus);
router.put("/:id", updateOrderStatus);
router.delete("/:id", deleteOrder);

module.exports = router;
