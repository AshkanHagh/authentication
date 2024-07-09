import express, { type NextFunction, type Request, type Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { ErrorMiddleware } from './middlewares/error';

import userRouter from './routes/auth.route';

export const app = express();

app.use(express.json({ limit : '50mb' }));
app.use(cookieParser());
app.use(cors({origin : process.env.ORIGIN}));

app.get('/', (req : Request, res : Response) => res.status(200).json({message : 'Success'}));

app.use('/api/v1/auth', userRouter);

app.get('*', (req : Request, res : Response, next : NextFunction) => {
    const error = new Error(`Route ${req.originalUrl} not found`) as any;
    next(error);
});

app.use(ErrorMiddleware);