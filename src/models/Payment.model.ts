import mongoose, { Schema, Model } from "mongoose";
import { IPayment } from "../interfaces/IPayment";

const paymentSchema: Schema = new mongoose.Schema(
  {
    order: {
      items: [
        {
          itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
          name: { type: String, required: true },
          quantity: { type: Number, required: true },
          price: { type: Number, required: true },
        },
      ],
      totalPrice: { type: Number, required: true },
      totalQuantity: { type: Number, default: 0 },
      orderId: { type: String } // Add orderId to store the frontend orderId
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "usd",
    },
    paymentIntentId: {
      type: String,
      required: true,
      unique: true,
      // Remove index: true to avoid duplicate index warning
    },
    status: {
      type: String,
      enum: ["pending", "confirmed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Keep only one index declaration for paymentIntentId
paymentSchema.index({ paymentIntentId: 1 });
// Add an index for orderId to make lookups faster
paymentSchema.index({ 'order.orderId': 1 });
paymentSchema.index({ createdAt: 1 });

// Create and export the model
const Payment: Model<IPayment> = mongoose.model<IPayment>("Payment", paymentSchema);

export default Payment;