import * as express from 'express';
import controller from './controller';

export default express
  .Router()
  .post('/register', controller.register)
  .post('/login', controller.login)