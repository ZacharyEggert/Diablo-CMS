import { RequestContext } from '@mikro-orm/core';
import { Listing } from '@entities/Listing';
import { RequestHandler } from 'express';

export const getListings: RequestHandler = async (_, res) => {
    const em = RequestContext.getEntityManager();
    if (em === null || em === undefined) {
        res.status(500).send('No entity manager found');
        return;
    }
    em.find(Listing, {}).then((users) => {
        res.json(users);
    });
};
