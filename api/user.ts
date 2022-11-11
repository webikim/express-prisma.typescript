import express, { Request, Response, Router, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
export const userRouter: Router = express.Router();

userRouter.post('/', async (req: Request, res: Response) => {
    const { username } = req.body;

    const userExists = await prisma.user.findUnique({
        where: {
            username,
        },
        select: {
            username: true
        }
    })

    if (userExists) {
        return res.status(400).json({
            status: 'error',
            message: 'already exists.'
        })
    }

    const newUser = await prisma.user.create({
        data: {
            username,
        }
    })
    res.json({
        status: 'OK',
        message: 'create successful.',
        newUser
    })
})

userRouter.get('/:username', async (req: Request, res: Response) => {
    const { username } = req.params;
    const user = await prisma.user.findFirst({
        where: {
            username,
        },
        select: {
            id: true,
            username: true
        }
    })
    res.json({
        status: 'OK',
        message: 'success',
        data: user
    })
});

userRouter.delete('/:username', async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;

    try {
        const result = await prisma.user.delete({
            where: {
                username: username
            }
        })
        res.json({
            status: 'OK',
            message: 'delete successful.',
            data: result
        })
    } catch (error) {
        next(error);
        res.json({
            status: 'error',
            message: 'delete failed.'
        })
    }
})

userRouter.post('/signin', async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.body;

    if (!process.env.SECRET) {
        throw Error('env SECRET is not defined.')
    }

    const result = await prisma.user.findUnique({
        where: {
            username: username
        }
    })

    if (result) {
        try {
            const token = jwt.sign({ name: username },
                process.env.SECRET!,
                { expiresIn: '1h' },
            );
            res.json({
                status: 'OK',
                message: 'token generated.',
                data: {
                    token: token
                }
            });
            return;
        } catch (error) {
            next(error);
            res.json({
                status: 'error',
                message: 'cannot generate token.'
            });
            return;
        }
    }

    res.json({
        status: 'error',
        message: 'signin failed.'
    })
})