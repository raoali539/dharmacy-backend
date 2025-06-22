import * as express from 'express';
import controller from './controller';

export default express
  .Router()

  // Authentication Routes

  .post('/v1/register', controller.register)
  .post('/v1/login', controller.logIn)
  .post('/v1/signupwithgoogle', controller.signUpWithGoogle)

  // Category Routes

  .get("/v1/getAllCategories", controller.getAllCategories)
  .post("/v1/createCategory", controller.createCategory)
  .put("/v1/updateCategory/:id", controller.updateCategory)
  .delete("/v1/deleteCategory/:id", controller.deleteCategory)
  
  // Product Routes
  
  .post('/v1/createProduct', controller.createProduct)
  .get('/v1/getAllProducts', controller.getAllProducts)
  .put("/v1/updateProduct/:id", controller.updateProduct)
  .delete("/v1/deleteProduct/:id", controller.deleteProduct)
  .get('/v1/getProductbyid', controller.getProductbyid)


  // Filter and Search Routes

  .get('/v1/productbycategory', controller.productByCategory)
  .get("/v1/getProductsByPriceRange/filter/price-range", controller.getProductsByPriceRange)
  .get("/v1/getProductsByCategoryAndPrice/filter/:category", controller.getProductsByCategoryAndPrice)
  
  // Checkout Routes

  .post('/v1/checkOut', controller.checkOut)


  // Admin Apis
