import express, { Router } from 'express';
import { userRouter } from './user';
import { postRouter } from './post';

export const apiRouter: Router = express.Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/post', postRouter);
// apiRouter.use('/prismatest', require('./prismatest'))

// module.exports = router;
