import {
  createAccount,
  authenticateOTP,
  authenticateForLogin,
  resendOtpHandler,
  sellProductHandler,
  productByCategoryHandler,
  getAllProductsHandler,
  getAllProductsByIdHandler,
  createAccountWithGoogle,
  createOrder,
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
          .json({ message: result.message, redirect: "/otp" });
      }
    } catch (error) {
      console.error("Error in signUp:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async logIn(req, res) {
    try {
      const result = await authenticateForLogin(req.body);
      if (result.success === false) {
        return res.status(400).json({ message: result.message });
      }
      return res
        .status(200)
        .json({ message: result.message, redirect: "/home" });
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

  async getAllProducts(req, res) {
    try {
      const result = await getAllProductsHandler();

      if (result.success === false) {
        return res.status(404).json({ message: result.message });
      }

      return res.status(200).json({ products: result.products });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async sellProduct(req, res) {
    try {
      const result = await sellProductHandler(req.body);

      if (!result) {
        res.status(400).json({ message: result.message });
      }

      res.status(201).json({ message: result.message });
    } catch (error) {
      console.error("Error in addProduct:", error);
      res.status(500).json({ message: "Internal server error" });
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

  async productById(req, res) {
    const productId = req.params.productId || req.query.productId;
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
}
export default new Controller();
