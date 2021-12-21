import 'reflect-metadata';

import './moduleAlias';
import dotenv from 'dotenv';
dotenv.config();

import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

import express from 'express';
import resolvers from './resolvers';
import MikroOrmConfig from './mikro-orm.config';
import { buildSchema } from 'type-graphql';
import { PORT } from './constants';

const main = async () => {
    const orm = await MikroORM.init<PostgreSqlDriver>(MikroOrmConfig);
    orm.getMigrator().up();

    const app = express();

    const apolloServer = new ApolloServer({
        context: ({
            req,
            res,
        }: {
            req: express.Request;
            res: express.Response;
        }) => ({ em: orm.em, req, res }),
        schema: await buildSchema({
            validate: false,
            resolvers,
        }),
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
    });

    console.log('Starting server...');
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/graphql' });
    console.log('Server started!');

    app.listen(PORT, () => {
        console.log('GraphQL is running on port:', PORT);
    });
};

main();
