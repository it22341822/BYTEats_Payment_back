const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
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
    default: "requires_payment_method"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add index for better query performance
paymentSchema.index({ paymentIntentId: 1 });
paymentSchema.index({ createdAt: 1 });

module.exports = mongoose.model("Payment", paymentSchema);