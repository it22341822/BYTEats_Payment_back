const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  order: {
    items: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ],
    totalQuantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
  },
  
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: "usd"
  },
  paymentIntentId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
      type: String,
      default: "pending",
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"]
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

paymentSchema.index({ paymentIntentId: 1 });
paymentSchema.index({ createdAt: 1 });

module.exports = mongoose.model("Payment", paymentSchema);