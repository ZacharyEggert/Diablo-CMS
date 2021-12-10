import { ConnectionOptions } from 'typeorm';

const connectionSettings: ConnectionOptions = {
    type: 'mongodb',
    host: '127.0.0.1',
    port: 27017,
    database: 'diablocms',
    synchronize: true,
    logging: true,
    entities: [__dirname + '/models/**/*.ts', __dirname + '/models/**/*.js'],
    migrations: [
        __dirname + '/migration/**/*.ts',
        __dirname + '/migration/**/*.js',
    ],
    subscribers: [
        __dirname + '/subscriber/**/*.ts',
        __dirname + '/subscriber/**/*.js',
    ],
    useNewUrlParser: true,
    useUnifiedTopology: true,
    name: 'default',
};

export default connectionSettings;
