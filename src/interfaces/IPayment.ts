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
}

export interface IPayment {
  order?: IOrder;
  currency: string;
  paymentIntentId: string;
  status: "pending" | "confirmed"; 
  paymentMethod: string; 
  createdAt: Date;
  updatedAt: Date; 
}
