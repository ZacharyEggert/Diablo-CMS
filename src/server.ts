import dotenv from 'dotenv';
dotenv.config();
import { PORT, MONGODB_URL } from './constants';
// import * as models from './models';
import express from 'express';
import mongoose from 'mongoose';

import router from './routes';

const app = express();

mongoose.connect(MONGODB_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    // models.User.findOne(
    //     {
    //         where: { username: 'admin' },
    //     },
    //     { password: 0, __v: 0, createdAt: 0, updatedAt: 0 }
    // )
    //     .then((user) => {
    //         console.log(user);
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
});
