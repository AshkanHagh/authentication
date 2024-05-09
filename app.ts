import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { ErrorMiddleware } from './middlewares/error';
import authRouter from './routes/auth.route';

export const app = express();

app.use(express.json({limit : '10mb'}));
app.use(cors({origin : process.env.ORIGIN}));
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);

app.get('/', (req, res) => res.status(200).json({message : 'Welcome'}));
app.get('*', (req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found`) as any;
    next(error);
});


app.use(ErrorMiddleware);