import { Document, Types } from "mongoose";

export interface IOrderItem {
  itemId: Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
}

export interface IOrder {
  items: IOrderItem[];
  totalQuantity: number;
  totalPrice: number;
}

export interface IPayment extends Document {
  order?: IOrder;
  amount: number;
  currency: string;
  paymentIntentId: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
}