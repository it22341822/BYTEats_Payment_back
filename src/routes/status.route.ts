import express from 'express';
import { updatePaymentStatus, getPaymentStatus } from '../controllers/statusController';

const router = express.Router();

// Get payment status
router.get('/:id',
async(req: express.Request, res: express.Response, next: express.NextFunction) =>{
    try {
        await getPaymentStatus(req,res);
    } catch (error){
        next(error);
    }
 }
);

// Update payment status
router.put('/:id',
async(req: express.Request, res: express.Response, next: express.NextFunction) =>{
    try {
        await updatePaymentStatus(req,res);
    } catch (error){
        next(error);
    }
 }
);



export default router;