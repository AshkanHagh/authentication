import express, { type NextFunction, type Request, type Response } from 'express';
export const app = express();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ErrorMiddleware } from './middlewares/error';

import userRouter from './routes/auth.route';

app.use(express.json({ limit : '50mb' }));
app.use(cookieParser());
app.use(cors({
    origin : process.env.ORIGIN
}));

app.use('/api/v1/auth', userRouter);

app.get('/', (req : Request, res : Response, next : NextFunction) => {
    res.status(200).json({message : 'Success'});
});

app.get('*', (req : Request, res : Response, next : NextFunction) => {
    const error = new Error(`Route ${req.originalUrl} not found`) as any;
    next(error);
});

app.use(ErrorMiddleware);