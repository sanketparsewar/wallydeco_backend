const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    description: { type: String },
    discount: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    maxUses: { type: Number },
    usedCount: { type: Number, default: 0 },
    minAmount:{type:Number}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);