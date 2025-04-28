import { Request, Response } from "express";
import Stripe from "stripe";
import Payment from "../models/Payment.model";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-03-31.basil",
  typescript: true,
});

interface OrderItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
}

interface PaymentRequestBody {
  orderId: string;
  totalPrice: number;
  currency?: string;
  items?: OrderItem[];
  paymentMethodId?: string;// Add payment method ID
  statustrack?: string; 
}

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { orderId, totalPrice, currency, items = [], paymentMethodId, statustrack } = req.body as PaymentRequestBody;
    
    // Validate that totalPrice is a number
    if (isNaN(totalPrice) || totalPrice <= 0) {
      return res.status(400).json({ error: "Invalid totalPrice value" });
    }

    const amount = Math.round(totalPrice * 100); // Convert to cents and ensure it's an integer
    
    // Calculate total quantity from items
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    // Create payment intent with Stripe
    // Now include the payment method if provided
    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount,
      currency: currency || "usd",
      metadata: { orderId },
      automatic_payment_methods: {
        enabled: true,
      },
    };

    // If a payment method ID was provided, attach it to the payment intent
    if (paymentMethodId) {
      paymentIntentParams.payment_method = paymentMethodId;
      paymentIntentParams.confirm = false; // Don't confirm yet, let the client confirm it
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

    // Save payment record to database
    const payment = new Payment({
      order: {
        items: items.length > 0 ? items : [], // Use provided items or empty array
        totalPrice,
        totalQuantity: totalQuantity || 0,
        orderId // Store the frontend order ID
      },
      amount,
      currency: currency || "usd",
      paymentIntentId: paymentIntent.id,
      status: "pending",
      statustrack: statustrack || "pending", // Add the statustrack field with default value
      paymentMethod: "credit_card", // Default payment method
    });

    await payment.save();

    // Log successful creation
    console.log(`Payment intent created: ${paymentIntent.id} for order: ${orderId}`);

    // Respond with the client secret (required by the frontend)
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: paymentIntent.id,
      amount: amount,
      currency: currency || "usd",
      statustrack: payment.statustrack
    });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Verify payment status function with statustrack update
export const verifyPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.params;
    
    if (!paymentIntentId) {
      return res.status(400).json({ error: "Payment intent ID is required" });
    }

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Update the payment record in the database
    if (paymentIntent.status === "succeeded") {
      await Payment.findOneAndUpdate(
        { paymentIntentId },
        { 
          status: "confirmed",
          statustrack: "confirmed" // Update statustrack as well
        }
      );
    } else if (paymentIntent.status === "requires_payment_method") {
      // Handle the case where payment requires a new payment method
      await Payment.findOneAndUpdate(
        { paymentIntentId },
        { statustrack: "requires_payment_method" }
      );
    }

    // Return the payment status
    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      paymentMethod: paymentIntent.payment_method_types[0] || "unknown"
    });
  } catch (error) {
    console.error("Error verifying payment status:", error);
    res.status(500).json({ error: "Failed to verify payment status" });
  }
};
