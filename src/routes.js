import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import User from './app/models/User';
import validation from './app/middlewares/validation';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', User.rules().store, validation, UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', User.rules().update, validation, UserController.update);

export default routes;
