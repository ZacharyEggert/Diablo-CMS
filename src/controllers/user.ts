import { RequestContext } from '@mikro-orm/core';
import { User } from '@entities/User';
import { RequestHandler } from 'express';
import { validateEmail } from '@lib/validation';

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

    if (!req.body.username) {
        res.status(400).send({ error: { message: 'Username is required' } });
        return;
    }
    if (!req.body.email) {
        res.status(400).send({ error: { message: 'Email is required' } });
        return;
    }
    if (!req.body.password) {
        res.status(400).send({ error: { message: 'Password is required' } });
        return;
    }

    if (!validateEmail(req.body.email)) {
        res.status(400).json({ error: { message: 'Invalid email' } });
        return;
    }

    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;
    // user.accessRevoked = false;

    em.persistAndFlush(user)
        .then(() => {
            res.json({ user });
        })
        .catch((err) => {
            res.status(500).send({ error: { message: 'Server Error' } });
            console.error(err);
        });
};

export const getUser: RequestHandler = async (req, res) => {
    const em = RequestContext.getEntityManager();
    if (em === null || em === undefined) {
        res.status(500).send('No entity manager found');
        return;
    }
    try {
        const user = await em.findOne(User, { id: parseInt(req.params.id) });
        if (user === null || user === undefined) {
            res.status(404).send('User not found');
            return;
        }
        res.json({ user });
    } catch (err) {
        res.status(500).send({ error: { message: 'Server Error' } });
        console.error(err);
    }
};

export const deleteUser: RequestHandler = async (req, res) => {
    const em = RequestContext.getEntityManager();
    if (em === null || em === undefined) {
        res.status(500).send('No entity manager found');
        return;
    }
    try {
        const user = await em.findOne(User, { id: parseInt(req.params.id) });
        if (user === null || user === undefined) {
            res.status(404).send('User not found');
            return;
        }
        em.removeAndFlush(user);
        res.json({ user });
    } catch (err) {
        res.status(500).send({ error: { message: 'Server Error' } });
        console.error(err);
    }
};
