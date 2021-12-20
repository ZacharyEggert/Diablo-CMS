import { Connection, IDatabaseDriver, EntityManager } from '@mikro-orm/core';
import { Request, Response } from 'express';
// import { Session } from 'express-session';

export type GQLContext = {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
    req: RequestOverload;
    res: Response;
};

// export type SessionOverload = Session & {
//     userId?: number;
//     [key: string]: any;
// }

export type RequestOverload = Request & {
    // session?: SessionOverload;
};
