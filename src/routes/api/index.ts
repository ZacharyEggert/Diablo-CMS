import { Router } from 'express';
import userRouter from './user';
import listingRouter from './listing';

const router = Router();

router.use('/user', userRouter);
router.use('/listing', listingRouter);

export default router;
