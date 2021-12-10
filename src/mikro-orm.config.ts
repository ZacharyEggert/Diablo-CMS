import {
    POSTGRES_DB,
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
} from './constants';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from './entities/User';

const MikroOrmConfig: Options<PostgreSqlDriver> = {
    entities: [User],
    migrations: {
        path: __dirname + '/migrations',
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    dbName: POSTGRES_DB,
    type: 'postgresql',
    debug: true,
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    metadataProvider: TsMorphMetadataProvider,
};

export default MikroOrmConfig;
