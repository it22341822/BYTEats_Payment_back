import type { IPayment } from "../interfaces/IPayment"; 
import { Request, Response } from "express";
import Stripe from "stripe";
import Payment from "../models/Payment";

import dotenv from "dotenv";
dotenv.config(); 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-03-31.basil",
  typescript: true,
});

interface PaymentIntentRequest {
  amount: number;
}

interface PaymentIntentResponse {
  clientSecret: string;
  paymentId: string;
}

export const createPaymentIntent = async (req: Request, res: Response) => {
  const { amount } = req.body as PaymentIntentRequest;

  try {
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const amountInCents = Math.round(parseFloat(amount.toString()) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    const payment = new Payment({
      amount: amountInCents,
      currency: "usd",
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
    });

    await payment.save();

    const response: PaymentIntentResponse = {
      clientSecret: paymentIntent.client_secret as string,
      paymentId: (payment._id as unknown as string).toString(),
    };

    res.send(response);
  } catch (error: any) {
    console.error("Error in payment processing:", error);
    res.status(500).json({
      error: error.message,
      details: error,
    });
  }
};
