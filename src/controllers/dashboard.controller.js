const Order = require("../models/order");
const Wallpaper = require('../models/wallpaper'); // Import the Wallpaper model
const UsedCoupon = require("../models/usedCoupon");
const Coupon = require('../models/coupon');
const Category = require("../models/category");
const User = require("../models/user");
const City = require("../models/city");


exports.getDashboardData = async (req, res) => {
    try {
        const totalCoupons = await Coupon.countDocuments();
        const totalUsedCoupons = await UsedCoupon.countDocuments();
        const totalCities = await City.countDocuments();
        const totalCategories = await Category.countDocuments();
        const totalWallpapers = await Wallpaper.countDocuments();
        const totalStock = await Wallpaper.aggregate([
            {
                $group: {
                    _id: null,
                    totalStock: { $sum: "$stock" }
                }
            }
        ]);
        const totalSold = await Wallpaper.aggregate([
            {
                $group: {
                    _id: null,
                    totalSold: { $sum: "$sold" }
                }
            }
        ]);

        const totalOrders = await Order.countDocuments();
        const totalCancelledOrders = await Order.countDocuments({ status: "Cancelled" });
        const totalDeliveredOrders = await Order.countDocuments({ status: "Delivered" });
        const totalShippedOrders = await Order.countDocuments({ status: "Shipped" });
        const totalPendingOrders = await Order.countDocuments({ status: "Pending" });
        const totalUsers = await User.countDocuments();

        const totalSales = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$finalAmount" }
                }
            }
        ]);

        res.status(200).json({
            totalOrders,
            totalSales: totalSales[0] ? totalSales[0].totalSales : 0,
            totalCoupons,
            totalUsedCoupons,
            totalCities,
            totalWallpapers,
            totalStock: totalStock[0] ? totalStock[0].totalStock : 0,
            totalSold: totalSold[0] ? totalSold[0].totalSold : 0,
            totalCancelledOrders,
            totalDeliveredOrders,
            totalShippedOrders,
            totalPendingOrders,
            totalUsers,
            totalCategories
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
