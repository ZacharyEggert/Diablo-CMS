import { RequestContext } from '@mikro-orm/core';
import { User } from '@entities/User';
import { RequestHandler } from 'express';

export const getAllUsers: RequestHandler = async (_, res) => {
    const em = RequestContext.getEntityManager();

    if (em === null || em === undefined) {
        res.status(500).send('No entity manager found');
        return;
    }

    em.find(User, {}).then((users) => {
        res.json(users);
    });
};

export const createUser: RequestHandler = async (req, res) => {
    const em = RequestContext.getEntityManager();

    if (em === null || em === undefined) {
        res.status(500).send('No entity manager found');
        return;
    }

    const user = new User();
    user.username = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;

    em.persistAndFlush(user)
        .then(() => {
            res.json(user);
        })
        .catch((err) => {
            res.status(500).send(err);
            console.error(err);
        });
};
