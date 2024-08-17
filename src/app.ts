import './configs/instrument';
import { Hono, type Context} from 'hono';
import { ErrorMiddleware } from './libs/utils/errorHandler';
import { createRouteNotFoundError } from './libs/utils/customErrors';
import { logger } from 'hono/logger';

const app = new Hono();

app.use(logger());

app.all('/', (context : Context) => context.json({success : true, message : 'Welcome to hono-auth'}, 200));
app.notFound((context: Context) => {throw createRouteNotFoundError(`Route : ${context.req.url} not found`)});
app.onError(ErrorMiddleware);

export default app;