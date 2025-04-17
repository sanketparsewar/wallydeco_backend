const mongoose = require("mongoose");

const usedCouponSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    couponCode: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UsedCoupon", usedCouponSchema);
