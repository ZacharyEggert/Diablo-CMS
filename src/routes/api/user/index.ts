import { Router } from 'express';
import {
    createUser,
    deleteUser,
    getAllUsers,
    getUser,
} from '@controllers/user';
const userRouter = Router();

userRouter.get('/', getAllUsers);

userRouter.post('/', createUser);

userRouter.get('/:id', getUser);

userRouter.delete('/:id', deleteUser);

export default userRouter;
