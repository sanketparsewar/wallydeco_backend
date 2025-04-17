const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      wallpaper: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wallpaper",
        required: true,
      },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 0 },
    },
  ],
  totalAmount: { type: Number, required: true, min: 0 },
  deliveryFee: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  couponCode: { type: String },
  finalAmount: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ["Order successful", "Shipped", "Delivered", "Cancelled"],
    default: "Order successful"
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, default: "India" }
  },
  paymentMethod: {
    type: String,
    enum: ["cod", "upi", "card"],
    required: true
  },
  upiId: {
    type: String,
    validate: {
      validator: function (v) {
        return this.paymentMethod !== 'upi' || /^[\w.-]+@[\w]+$/.test(v);
      },
      message: props => `Invalid UPI ID`
    }
  },
  orderDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
