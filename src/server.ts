import dotenv from 'dotenv';
dotenv.config();
import { PORT } from './constants';

import express from 'express';

const app = express();

app.get('/', (_, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
