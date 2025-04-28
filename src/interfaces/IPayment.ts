import mongoose from 'mongoose';

interface IOrderItem {
  itemId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
}

export interface IOrder {
  items: IOrderItem[];
  totalPrice: number;
  totalQuantity: number;
  orderId?: string; // Added orderId to IOrder interface
}

export interface IPayment {
  order?: IOrder;
  amount: number; // Added amount field since it's required in the model
  currency: string;
  paymentIntentId: string;
  status: "pending" | "confirmed"; 
  paymentMethod: string; 
  createdAt: Date;
  updatedAt: Date;
  statustrack: "pending"| "confirmed"| "shipped"| "delivered"| "cancelled"|"requires_payment_method";
}

