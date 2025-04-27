import mongoose, { Document, Schema, Model } from "mongoose";

interface IOrderItem {
  itemId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
}

interface IOrder {
  items: IOrderItem[];
  totalQuantity: number;
  totalPrice: number;
}

export interface IPayment extends Document {
  order?: IOrder;
  amount: number;
  currency: string;
  paymentIntentId: string;
  status: "pending" | "confirmed" ;
  createdAt: Date;
}

//  schema
const paymentSchema: Schema = new mongoose.Schema({
  order: {
    items: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalQuantity: { type: Number, required: true },
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
    default: "unpaid",
    enum: ["paid", "unpaid"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

paymentSchema.index({ paymentIntentId: 1 });
paymentSchema.index({ createdAt: 1 });

// Create and export the model
const Payment: Model<IPayment> = mongoose.model<IPayment>("Payment", paymentSchema);

export default Payment;