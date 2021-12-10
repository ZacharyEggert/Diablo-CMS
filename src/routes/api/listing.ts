import { getListings } from '@controllers/listing';
import { Router } from 'express';
const listingRouter = Router();

listingRouter.get('/', getListings);

export default listingRouter;
