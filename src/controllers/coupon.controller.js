const Coupon = require('../models/coupon')
const UsedCoupon = require("../models/usedCoupon");

exports.createCoupon = async (req, res) => {
  try {
    const coupon = new Coupon(req.body)
    await coupon.save()
    res.status(201).json(coupon)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find()
    res.status(200).json(coupons)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' })
    res.status(200).json(coupon)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' })
    res.status(200).json(coupon)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id)
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' })
    res.status(200).json({ message: 'Coupon deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


exports.applyCoupon = async (req, res) => {
  try {
    const { user, couponCode } = req.body;

    if (!user || !couponCode) {
      return res.status(400).json({ message: "user and couponCode are required." });
    }

    const coupon = await Coupon.findOne({ code: couponCode.trim().toUpperCase(), active: true });
    if (!coupon) {
      return res.status(404).json({ message: "Invalid or inactive coupon code." });
    }

    // Check expiry date
    const now = new Date();
    if (now < new Date(coupon.startDate) || now > new Date(coupon.endDate)) {
      return res.status(400).json({ message: "Coupon has expired or is not yet valid." });
    }

    // Check if max usage limit reached globally
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ message: "Coupon usage limit reached." });
    }

    // Check if user has already used this coupon
    const alreadyUsed = await UsedCoupon.findOne({ user, couponCode });
    if (alreadyUsed) {
      return res.status(400).json({ message: "You have already used this coupon." });
    }

    // // Log usage
    // await UsedCoupon.create({ user, couponCode });

    // // Increment coupon usage count
    // coupon.usedCount = (coupon.usedCount || 0) + 1;
    // await coupon.save();

    // Send full coupon object (for discount, description, validity, etc.)
    return res.status(200).json({ success: true, coupon });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
