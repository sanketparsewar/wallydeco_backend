const Coupon = require('../models/coupon')
const UsedCoupon = require("../models/usedCoupon");
const { capitalizeFirst, upperCase } = require('../utils/stringTransform')


exports.createCoupon = async (req, res) => {
  try {
    let coupon = new Coupon(req.body)
    coupon.code=upperCase(coupon.code.trim())
    coupon.startDate = new Date(coupon.startDate)
    coupon.endDate = new Date(coupon.endDate)
    if (coupon.startDate >= coupon.endDate) {
      return res.status(400).json({ message: "Start date must be before end date." });
    }
    if (coupon.maxUses && coupon.maxUses <= 0) {
      return res.status(400).json({ message: "Max uses must be greater than 0." });
    }
    if (coupon.minAmount && coupon.minAmount <= 0) {
      return res.status(400).json({ message: "Min amount must be greater than 0." });
    }
    if (coupon.discount <= 0) {
      return res.status(400).json({ message: "Discount must be greater than 0." });
    }
    await coupon.save()
    res.status(201).json({coupon})
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 })
    if (!coupons || coupons.length === 0) return res.status(404).json({ message: 'No coupons found' })
    res.status(200).json({coupons})
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' })
    res.status(200).json(coupon)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateCoupon = async (req, res) => {
  try {
    let coupon=req.body
    coupon.code=upperCase(coupon.code.trim())
    const gotCoupon = await Coupon.findByIdAndUpdate(req.params.id, {...req.body,code:coupon.code}, { new: true })
    if (!gotCoupon) return res.status(404).json({ message: 'Coupon not found' })
    res.status(200).json(gotCoupon)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id)
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' })
    res.status(200).json({ message: 'Coupon deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


exports.applyCoupon = async (req, res) => {
  try {
    const { user, couponCode } = req.body;

    if (!user || !couponCode) {
      return res.status(400).json({ message: "user and couponCode are required." });
    }

    const coupon = await Coupon.findOne({ code: couponCode.trim().toUpperCase(), isActive: true });
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

    // Send full coupon object (for discount, description, validity, etc.)
    return res.status(200).json({ success: true, coupon });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
