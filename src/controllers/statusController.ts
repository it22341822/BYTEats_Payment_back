import mongoose from 'mongoose';
import { Request, Response } from 'express';
import Payment from '../models/Payment.model';
import { emitStatusUpdate } from '../services/socketServices';


export const updatePaymentStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { statustrack } = req.body;  // <- Here's the issue
        
        // Validate status
        const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled", "requires_payment_method"];
        if (!validStatuses.includes(statustrack)) {
          res.status(400).json({ success: false, message: 'Invalid status' });
          return;
        }
    
    // Find and update payment
    const payment = await Payment.findByIdAndUpdate(
        id,
        { statustrack: statustrack },
        { new: true }
    );
    
    console.log('Found payment:', payment);
    
    if (!payment) {
      res.status(404).json({ success: false, message: 'Payment not found' });
      return;
    }
    
    // Emit socket event for real-time updates
    emitStatusUpdate((payment._id as mongoose.Types.ObjectId).toString(), statustrack);
    
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getPaymentStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      const payment = await Payment.findById(id);
      
      if (!payment) {
        res.status(404).json({ success: false, message: 'Payment not found' });
        return;
      }
      
      // Get current timestamp or use the createdAt field from the payment
      const timestamp = new Date().toISOString();
      
      res.status(200).json({ 
        success: true, 
        data: { 
          id: payment._id, 
          statustrack: payment.statustrack,
          timestamp: timestamp 
        } 
      });
    } catch (error) {
      console.error('Error fetching payment status:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

