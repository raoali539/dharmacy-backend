import * as express from 'express';
import controller from './controller';

export default express
  .Router()

  // User Apis

  .post('/v1/register', controller.register)
  .post('/v1/login', controller.logIn)
  .get('/v1/allproducts', controller.getAllProducts)
  .get('/v1/productbycategory', controller.productByCategory)
  .get('/v1/productbyid', controller.productById)
  .post('/v1/signupwithgoogle', controller.signUpWithGoogle)
  .post('/v1/checkOut', controller.checkOut)

// Admin Apis

  .post('/v1/sellproduct', controller.sellProduct)