import 'reflect-metadata';

import './moduleAlias';
import dotenv from 'dotenv';
dotenv.config();
import { CLIENT_CORS_URL, DASHBOARD_CORS_URL, PORT, REVERB_API_KEY, SESSION_COOKIE_NAME, SESSION_SECRET, __PROD__ } from './constants';

import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

import express from 'express';
import cors, { CorsOptions } from 'cors';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

import { ReverbApiClient } from '@zacharyeggert/reverb-api/';

import resolvers from './resolvers';
import MikroOrmConfig from './mikro-orm.config';
import { buildSchema } from 'type-graphql';


const main = async () => {
    const orm = await MikroORM.init<PostgreSqlDriver>(MikroOrmConfig);
    orm.getMigrator().up();

    const app = express();

    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();

    const corsSettings: CorsOptions = {
        origin: [CLIENT_CORS_URL, DASHBOARD_CORS_URL, 'https://studio.apollographql.com', 'http://localhost:4000'],
        credentials: true,
    }

    app.set('trust proxy', !__PROD__);


    app.use(
        cors(corsSettings)
    );

    app.use(
        session({
            store: new RedisStore({ client: redisClient, disableTouch: true }),
            name: SESSION_COOKIE_NAME,
            secret: SESSION_SECRET,
            resave: false,
            saveUninitialized: false,

            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
                sameSite: 'lax', // csrf
                httpOnly: false,
                secure: !!(__PROD__ && process.env.secure), // cookie only works in https

            },
        })
    );


    const reverbClient = new ReverbApiClient(REVERB_API_KEY);

    const apolloServer = new ApolloServer({
        context: ({
            req,
            res,
        }: {
            req: express.Request;
            res: express.Response;
        }) => ({ em: orm.em, req, res, rc: reverbClient }),
        schema: await buildSchema({
            validate: false,
            resolvers,
        }),
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
        introspection: true,
    });

    console.log('Starting server...');
    await apolloServer.start();
    apolloServer.applyMiddleware({
        app, path: '/graphql',
        cors: corsSettings
    });
    console.log('Server started!');

    app.listen(PORT, () => {
        console.log('GraphQL is running on port:', PORT);
    });
};

main();
