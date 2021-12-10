import {
    createUser,
    deleteUser,
    getAllUsers,
    getUser,
} from '@controllers/user';
import { Router } from 'express';

const userRouter = Router();

userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUser);

userRouter.post('/', createUser);
userRouter.delete('/:id', deleteUser);

export default userRouter;
