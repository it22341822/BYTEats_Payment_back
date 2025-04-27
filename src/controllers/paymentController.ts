import { Request, Response } from "express";
import Stripe from "stripe";
import Payment from "../models/Payment.model";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-03-31.basil",
    typescript: true,
});

interface PaymentIntentRequest{
    amount: number;
}

interface PaymentIntentResponse {
    clientSecret: string;
    paymentId: string;
}

export const createPaymentIntent = async (req: Request, res: Response) => {
    try {
      const { orderId, totalPrice, currency } = req.body;
  
      // Validate that totalPrice is a number
      if (isNaN(totalPrice) || totalPrice <= 0) {
        return res.status(400).json({ error: "Invalid totalPrice value" });
      }
  
      const amount = totalPrice * 100; // Convert to cents
  
      // Check if the calculated amount is a valid number
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount value" });
      }
  
      const paymentIntent = await stripe.paymentIntents.create({
        amount, // Amount in cents
        currency: currency || "usd",
        metadata: { orderId },
      });
  
      const payment = new Payment({
        order: {
          items: [], // Populate this from the order data
          totalPrice,
          totalQuantity: 0,
        },
        amount, // Amount in cents
        currency: currency || "usd",
        paymentIntentId: paymentIntent.id,
        status: "pending",
        paymentMethod: "credit_card", // This can be updated based on your payment method
        createdAt: new Date(),
        updatedAt: new Date(),
      });
  
      await payment.save();
  
      // Respond with the client secret (required by the frontend)
      res.json({ clientSecret: paymentIntent.client_secret, paymentId: paymentIntent.id });
    } catch (error) {
      console.error("Error creating PaymentIntent:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  