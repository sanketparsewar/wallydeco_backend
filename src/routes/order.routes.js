const express = require("express");
const router = express.Router();
const { placeOrder, getAllOrders, getOrderById, updateOrderStatus, deleteOrder } = require("../controllers/order.controller");
const { verifyJwt } = require("../middlewares/auth.middleware");

router.post("/", verifyJwt, placeOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.put("/:id", updateOrderStatus);
router.delete("/:id", deleteOrder);

module.exports = router;
