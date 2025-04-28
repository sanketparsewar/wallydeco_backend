const Coupon = require('../models/coupon')
const UsedCoupon = require("../models/usedCoupon");
const { upperCase } = require('../utils/stringTransform')


exports.createCoupon = async (req, res) => {
  try {
    let coupon = new Coupon(req.body)
    coupon.code = upperCase(coupon.code.trim())
    const existedcoupon=await Coupon.findOne({code:coupon.code})
    if(existedcoupon)
      return res.status(400).json({ message: "Coupon already exist." });

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
    // Set the `isActive` field based on the start date
    coupon.isActive = coupon.startDate <= new Date(); // If start date is in the past or today, isActive is true
    // If start date is in the future, isActive is false
   
    await coupon.save()
    res.status(201).json({ coupon })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.getCoupons = async (req, res) => {
  try {
    // Fetch all active coupons
    const coupons = await Coupon.find();
    if (!coupons || coupons.length === 0) {
      return res.status(404).json({ message: 'No coupons found' });
    }

    const now = new Date();
    const expiredCoupons = coupons.filter(coupon => coupon.endDate < now && coupon.isActive);

    // Update expired coupons
    const updates = expiredCoupons.map(coupon => {
      coupon.isActive = false;
      return coupon.save();
    });
    
    // Wait for all update operations to complete
    await Promise.all(updates);

    const updatedCoupons = await Coupon.find().sort({ isActive: -1, createdAt: -1 });

    // Send the updated coupons
    res.status(200).json({ coupons: updatedCoupons });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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
    let updatedData = req.body;
    updatedData.code = upperCase(updatedData.code.trim());

    const existingCoupon = await Coupon.findById(req.params.id);
    if (!existingCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    // If endDate is updated and it's a future date, reactivate the coupon
    const newEndDate = new Date(updatedData.endDate);
    const now = new Date();

    if (newEndDate > now) {
      updatedData.isActive = true;
    }
    // If the startDate is updated and it's a future date, deactivate the coupon
    const newStartDate = new Date(updatedData.startDate);
    if (newStartDate > now) {
      updatedData.isActive = false;  // Deactivate the coupon if startDate is in the future
    }

    const gotCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { ...updatedData },
      { new: true }
    );

    res.status(200).json(gotCoupon);

  } catch (error) {
    res.status(400).json({ message: error.message });
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
    console.log('call')
    if (!user || !couponCode) {
      return res.status(400).json({ message: "user and couponCode are required." });
    }

    const coupon = await Coupon.findOne({ code: couponCode.trim().toUpperCase(), isActive: true });
    if (!coupon) {
      return res.status(404).json({ message: "Invalid or inactive coupon code." });
    }

    const now = new Date();
    // Check expiry date 
    if (now < new Date(coupon.startDate) || now > new Date(coupon.endDate)) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(400).json({ message: "Coupon has expired or is not yet valid." });
    }
     // If date is valid but coupon is not active, activate it
     if (!coupon.isActive) {
      coupon.isActive = true;
      await coupon.save();
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
