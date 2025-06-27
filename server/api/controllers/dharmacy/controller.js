

import {
  createAccount,
  authenticateOTP,
  authenticateForLogin,
  resendOtpHandler,
  createProductHandler,
  productByCategoryHandler,
  getAllProductsHandler,
  getAllProductsByIdHandler,
  createAccountWithGoogle,
  createOrder,
  getAllCategoriesHandler,
  createCategoryHandler,
  updateCategoryById,
  deleteCategoryById,
  updateProductById,
  deleteProductById,
  productByPriceRangeHandler,
  productByCategoryAndPriceHandler,
  getLowInStockHandler,
  getHighInStock,
} from "../../services";

export class Controller {

  async register(req, res) {
    const { userName, contactNumber, email, password, sub } = req.body;

    try {
      if (!userName || !contactNumber || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const result = await createAccount(req.body, res);

      if (result.success === false) {
        return res.status(400).json({ message: result.message });
      } else {
        return res
          .status(201)
          .json({ message: result.message });
      }
    } catch (error) {
      console.error("Error in signUp:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async logIn(req, res) {
    const loginType = req.query.loginType || req.params.loginType;
    try {

      if (!loginType) {
        return res.status(403).json({ message: "Please Select Role" });
      }

      const result = await authenticateForLogin(req.body);

      if (result.success === false) {
        return res.status(400).json({ message: result.message });
      }

      const redirectPath = loginType === "1" ? "/userHome" : "/adminHome";

      return res.status(200).json({
        message: result.message,
        redirect: redirectPath,
        user: result.user,
      });
    } catch (error) {
      console.log(error);
      //   const errorData = new LogSchema({
      //     type: "error",
      //     message: error.message,
      //     stack: error.stack,
      //   });
      //   await errorData.save();
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async products(req, res) {
    try {
      let result;

      const type = req.query.type;

      if (type === "1") {
        result = await getAllProductsHandler();
      } else if (type === "2") {
        result = await getLowInStockHandler();
      } else if (type === "3") {
        result = await getHighInStock();
      }
      else if (type === "4") {
        const category = req.query.category || req.params.category;
        const skip = req.query.skip || req.params.skip || 0;
        result = await productByCategoryHandler({ category, skip });
      } else {
        return res.status(400).json({ message: "Invalid query type" });
      }

      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }

      return res.status(200).json({ products: result.products });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }


  async createProduct(req, res) {
    try {
     
      const result = await createProductHandler({ props: req.body, userId: req.userId });

      if (!result) {
        res.status(400).json({ message: result.message });
      }

      res.status(201).json({ message: result.message });
    } catch (error) {
      console.error("Error in addProduct:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateProduct(req, res) {
    try {
      const { id } = req.params;

      const result = await updateProductById(id, req.body);

      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }

      return res.status(200).json({ message: result.message, data: result.data });
    } catch (error) {
      console.error("Controller Error - updateProduct:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      const result = await deleteProductById(id);

      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }

      return res.status(200).json({ message: result.message });
    } catch (error) {
      console.error("Controller Error - deleteProduct:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async productByCategory(req, res) {
    try {
      const category = req.query.category || req.params.category;
      const skip = req.query.skip || req.params.skip; // pagination parameter to better scroll
      const result = await productByCategoryHandler({ category, skip });
      if (!result) {
        return res.status(404).json({ message: "Resutl not found" });
      }

      // result found
      return res.status(200).json({ data: result.products });
    } catch (error) {
      console.error("Error in addCategory:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getProductsByPriceRange(req, res) {
    try {
      const { minPrice, maxPrice } = req.query;

      const result = await productByPriceRangeHandler(Number(minPrice), Number(maxPrice));

      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      return res.status(200).json({ data: result.data });
    } catch (error) {
      console.error("Controller Error - getProductsByPriceRange:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getProductsByCategoryAndPrice(req, res) {
    try {
      const { category } = req.params;
      const { minPrice, maxPrice } = req.query;

      const result = await productByCategoryAndPriceHandler(
        category,
        Number(minPrice),
        Number(maxPrice)
      );

      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      return res.status(200).json({ data: result.data });
    } catch (error) {
      console.error("Controller Error - getProductsByCategoryAndPrice:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getProductbyid(req, res) {
    const productId = req.query.productId;
    // const skip = req.query.skip || req.params.skip; // pagination parameter to better scroll
    try {
      // Check if the category already exists
      const result = await getAllProductsByIdHandler(productId);
      if (result.success === false) {
        return res.status(404).json({ message: result.message });
      }

      // result found
      return res.status(200).json({ data: result.products });
    } catch (error) {
      console.error("Error in addCategory:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async signUpWithGoogle(req, res) {
    try {
      const result = createAccountWithGoogle(req.body, res);
      if (result.success === false) {
        return res.status(400).json({ message: result.message });
      }
      return res.status(201).json({ message: result.message, redirect: "/home" });
    } catch (error) {
      console.error("Error in signUpWithGoogle:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async checkOut(req, res) {
    try {
      const result = createOrder(req.body);
      if (result.success === false) {
        return res.status(400).json({ message: result.message });
      }
      return res.status(201).json({ message: result.message, });
      // return res.status(200).json({ message: "Checkout successful" });
    } catch (error) {
      console.error("Error in checkout:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async createCategory(req, res) {
    try {
      const result = await createCategoryHandler(req.body, res);

      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      return res.status(201).json({ message: result.message, data: result.data });
    } catch (error) {
      console.error("Controller Error - createCategory:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async updateCategory(req, res) {
    try {
      const { id } = req.params;

      const result = await updateCategoryById(id, req.body);

      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }

      return res.status(200).json({ message: result.message, data: result.data });
    } catch (error) {
      console.error("Controller Error - updateCategory:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async deleteCategory(req, res) {
    try {
      const { id } = req.params;

      const result = await deleteCategoryById(id);

      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }

      return res.status(200).json({ message: result.message });
    } catch (error) {
      console.error("Controller Error - deleteCategory:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getAllCategories(req, res) {
    try {
      const result = await getAllCategoriesHandler();

      if (!result.success) {
        return res.status(500).json({ message: result.message });
      }

      return res.status(200).json({ data: result.data });
    } catch (error) {
      console.error("Controller Error - getAllCategories:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

}
export default new Controller();
