import { Types } from "mongoose";

export interface IOrderItem {
  itemId: Types.ObjectId;
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
}