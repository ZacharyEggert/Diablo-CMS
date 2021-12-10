import 'reflect-metadata';

import dotenv from 'dotenv';
dotenv.config();

import { createConnection } from 'typeorm';
import connectionSettings from './connection';

import { PORT } from './constants';
import express from 'express';

import router from './routes';

const main = async () => {
    const connection = await createConnection({
        ...connectionSettings,
    });
    connection.runMigrations();

    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/', router);

    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
};

main();
