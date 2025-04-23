const Order = require("../models/order");
const Wallpaper = require('../models/wallpaper'); // Import the Wallpaper model
const UsedCoupon = require("../models/usedCoupon");
const Coupon = require('../models/coupon')
const User = require("../models/user");
const mongoose = require('mongoose')

exports.placeOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Validate required fields
    if (!req.body.user || !req.body.items || req.body.items.length === 0) {
      throw new Error("Missing required fields");
    }

    // Check stock availability for all items first
    for (const item of req.body.items) {
      const wallpaper = await Wallpaper.findById(item.wallpaper).session(session);
      if (!wallpaper) {
        throw new Error(`Wallpaper not found: ${item.wallpaper}`);
      }
      if (wallpaper.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${wallpaper.title}. Available: ${wallpaper.stock}, Requested: ${item.quantity}`);
      }
    }

    // Create order
    const order = new Order({
      user: req.body.user,
      items: req.body.items,
      totalAmount: req.body.totalAmount,
      deliveryFee: req.body.deliveryFee,
      discount: req.body.discount || 0,
      couponCode: req.body.couponCode,
      finalAmount: req.body.finalAmount,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      upiId: req.body.upiId
    });

    // Save order
    const savedOrder = await order.save({ session });

    // Update stock and sold count for each item
    for (const item of req.body.items) {
      await Wallpaper.findByIdAndUpdate(
        item.wallpaper,
        {
          $inc: {
            stock: -item.quantity,
            sold: item.quantity
          }
        },
        { session }
      );
    }

    if (req.body.couponCode) {
      const coupon = await Coupon.findOne({ code: req.body.couponCode.trim().toUpperCase(), active: true });

      // Log usage
      await UsedCoupon.create({ user: req.body.user, couponCode: req.body.couponCode });

      // Increment coupon usage count
      coupon.usedCount = (coupon.usedCount || 0) + 1;
      await coupon.save();
    }


    await session.commitTransaction();
    res.status(201).json({ message: 'Order created successfully', savedOrder });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ message: err.message });
  } finally {
    session.endSession();
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("user")
      .populate("items.wallpaper");
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.status === 'Delivered' || order.status === 'Shipped') {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }
    if (order.status === 'Cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    order.status = 'Cancelled';
    await order.save();

    res.status(200).json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("user")
      .populate("items.wallpaper");
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.status === 'Pending') {
      order.status = 'Shipped';
    }
    else if (order.status === 'Shipped') {
      order.status = 'Delivered';
      order.deliveryDate = new Date();
    }
    else if (order.status === 'Delivered') {
      return res.status(400).json({ message: 'Order already delivered' });
    }
    else if (order.status === 'Cancelled') {
      return res.status(400).json({ message: 'Order already Cancelled' });
    }
    await order.save();
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.wallpaper').sort({ orderDate: -1 });
    if (!orders) return res.status(404).json({ message: "No orders found" });
    res.status(200).json(orders);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
    try {
    const { search, city, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const pipeline = [];
    // Lookup user (to access user.name)
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user"
      }
    });

    pipeline.push({ $unwind: "$user" });

    // Lookup wallpapers
    pipeline.push({
      $lookup: {
        from: "wallpapers",
        localField: "items.wallpaper",
        foreignField: "_id",
        as: "items.wallpaper"
      }
    });

    // Filtering by search and city
    const matchStage = { $and: [] };

    if (search) {
      const regex = new RegExp(search, "i");
      const orConditions = [
        { "user.name": { $regex: regex } },
        { address: { $regex: regex } }
      ];

      if (mongoose.Types.ObjectId.isValid(search)) {
        orConditions.push({ _id: new mongoose.Types.ObjectId(search) });
      }

      matchStage.$and.push({ $or: orConditions });
    }

    if (city) {
      matchStage.$and.push({
        "shippingAddress.city": city
      });
    }

    if (matchStage.$and.length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Total count for pagination
    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await Order.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    // Pagination
    pipeline.push(
      { $sort: { orderDate: -1 } },
      { $skip: skip },
      { $limit: limitNum }
    );

    const orders = await Order.aggregate(pipeline);

    res.status(200).json({
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      orders
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate("items.wallpaper");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
