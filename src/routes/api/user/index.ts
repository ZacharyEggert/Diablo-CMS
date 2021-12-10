import { Router } from 'express';
import { User } from '../../../models/User';
import { getMongoManager } from 'typeorm';
const userRouter = Router();

userRouter.route('/').get(async (_, res) => {
    const em = getMongoManager('default');

    const users = await em.find(User, {}).catch((err) => {
        console.log(err);
    });
    if (users) {
        res.json(users);
    } else {
        res.status(404).json({
            message: 'No users found!',
        });
    }
});

export default userRouter;
