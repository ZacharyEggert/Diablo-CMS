import 'reflect-metadata';
import './moduleAlias';

import { MikroORM, RequestContext } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import router from '@routes';
import MikroOrmConfig from './mikro-orm.config';
import { PORT } from './constants';

const main = async () => {
    const orm = await MikroORM.init<PostgreSqlDriver>(MikroOrmConfig);

    orm.getMigrator().up();

    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use((_, __, next) => RequestContext.create(orm.em, next));

    app.use('/', router);

    app.all('*', (_, res) => {
        res.status(404).json({
            message: 'Not found',
        });
    });

    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
};

main();
