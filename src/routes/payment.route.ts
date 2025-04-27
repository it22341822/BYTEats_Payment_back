import express, { Router } from "express";
import { createPaymentIntent, verifyPaymentStatus } from "../controllers/paymentController";

const router: Router = express.Router();

// Create payment intent
router.post("/add", 
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      await createPaymentIntent(req, res);
    } catch (error) {
      next(error); 
    }
  }
);

// Verify payment status
router.get("/verify/:paymentIntentId", 
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      await verifyPaymentStatus(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;