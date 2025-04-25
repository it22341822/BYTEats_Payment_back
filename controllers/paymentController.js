const Stripe = require("stripe");
const Payment = require("../models/Payment");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  const { amount } = req.body;

  try {
    // Validate amount
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Convert amount to cents (Stripe requires integer amounts)
    const amountInCents = Math.round(parseFloat(amount) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
    });

    // Save to MongoDB with additional details
    const payment = new Payment({
      amount: amountInCents,
      currency: "usd",
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status, // Add status for better tracking
    });

    await payment.save();

    console.log("Payment saved to MongoDB:", payment); // Add logging

    res.send({ 
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id // Send back MongoDB ID for reference
    });
  } catch (error) {
    console.error("Error in payment processing:", error);
    res.status(500).json({ 
      error: error.message,
      details: error // Include more error details
    });
  }
};

module.exports = { createPaymentIntent };