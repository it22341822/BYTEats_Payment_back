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
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Indexes for fast querying
paymentSchema.index({ paymentIntentId: 1 });
paymentSchema.index({ createdAt: 1 });

// Create and export the model
const Payment: Model<IPayment> = mongoose.model<IPayment>("Payment", paymentSchema);

export default Payment;
