import { Router } from 'express';
import listingRouter from './listing';
import userRouter from './user';

const router = Router();

router.use('/user', userRouter);
router.use('/listing', listingRouter);

export default router;
