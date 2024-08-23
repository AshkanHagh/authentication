import { Hono } from 'hono';
import { validationMiddleware } from '../middlewares/validation';
import { authorizedRoles, isAuthenticated } from '../middlewares/authorization';
import { addQuestionSchema } from '../schemas';
import { addQuestion } from '../controllers/questions.controller';
import { handelIpRequest } from '../middlewares/ipChecker';

const questionRouter = new Hono();

questionRouter.post('/', handelIpRequest, isAuthenticated, authorizedRoles('genius-admin'), 
    validationMiddleware('json', addQuestionSchema), addQuestion
);

export default questionRouter;