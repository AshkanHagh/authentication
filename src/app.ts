import { Hono, type Context } from 'hono';
import { ErrorMiddleware } from './libs/utils/error';
import { RouteNowFoundError } from './libs/utils/customErrors';

const app = new Hono();

app.all('/', (context : Context) => context.json({success : true, message : 'Welcome to hono-auth'}, 200));
app.notFound((context : Context) => {throw new RouteNowFoundError(`Route : ${context.req.url} not found`)});
app.onError(ErrorMiddleware);

export default app;