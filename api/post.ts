import { PrismaClient } from '@prisma/client';
import express, { Router, Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();
export const postRouter: Router = express.Router();

postRouter.post('/', async (req: Request, res: Response) => {
    const { title, post, user_id } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            id: user_id
        }
    })

    if (!user) {
        res.status(400).json({
            status: "Not OK",
            message: "User not exists."
        })
        return;
    }

    const posted = await prisma.post.create({
        data: {
            title: title,
            post: post,
            user_id: user_id
        }
    })
    res.json({
        status: 'OK',
        message: 'insert successful.',
        data: posted
    })
});

postRouter.get('/user/:username', async (req: Request, res: Response) => {
    const { username } = req.params;

    const userposts = await prisma.user.findMany({
        where: {
            username: username
        },
        include: {
            post: true
        }
    })
    res.json({
        status: 'OK',
        message: 'get successful',
        data: userposts
    });
})

postRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const result = await prisma.post.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.json({
            status: 'OK',
            message: 'delete sucessful.',
            data: result
        })
    } catch (error) {
        next(error);
        res.json({
            status: 'error',
            message: 'delete failed.'
        })
    }
});