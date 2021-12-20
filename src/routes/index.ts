import { Router } from 'express';

const router = Router();

router.all('/api', (_, res) => {
    res.status(200).json({
        message: 'API is in GraphQL endpoint',
        _link: '/api/graphql',
    });
});

export default router;
