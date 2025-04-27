import express, { Router } from "express";
import { createPaymentIntent } from "../controllers/paymentController";

const router: Router = express.Router();

router.post("/create-payment-intent", 
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      await createPaymentIntent(req, res);
    } catch (error) {
      next(error); 
    }
  }
);

export default router;