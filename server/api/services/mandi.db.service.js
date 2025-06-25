// import Otp from "../../api/models/otpSchema";
import User from "../../api/models/userSchema";
import Order from "../../api/models/orderSchema";
import Category from "../../api/models/categorySchema";
import Product from "../../api/models/productSchema";
const nodemailer = require("nodemailer");

//export section
export {
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
  createCategoryHandler,
  updateCategoryById,
  deleteCategoryById,
  getAllCategoriesHandler,
  deleteProductById,
  updateProductById,
  productByPriceRangeHandler,
  productByCategoryAndPriceHandler,
  getLowInStockHandler,
  getHighInStock,
};


const createOrder = async (props) => {

  const { userId, items, shippingAddress } = props;

  if (!userId || !items || items.length === 0 || !shippingAddress) {
    // return res.status(400).json({ message: "Missing required fields." });
    return {
      success: false,
      message: "Missing required fields.",
    };
  }

  // Calculate total
  let totalAmount = 0;
  items.forEach((item) => {
    totalAmount += item.price * item.quantity;
  });

  // Optionally calculate tax or shipping fee here
  const shippingFee = 50; // flat rate (optional)
  const taxAmount = totalAmount * 0.1; // 10% tax

  // Create order
  const newOrder = new Order({
    userId,
    items,
    shippingAddress,
    totalAmount: totalAmount + shippingFee + taxAmount,
    shippingFee,
    taxAmount,
    paymentStatus: "pending",
    orderStatus: "processing",
    isPaid: false,
  });

  await newOrder.save();


  //next there will be payment integration logic

  return { success: true, message: "Order created successfully.", order: newOrder, };

}

const authenticateForLogin = async (props) => {
  if ("contactNumber" in props && "password" in props) {
    const { contactNumber, password } = props;
    const user = await User.findOne({ contactNumber, password });
    if (user && user.isOtpVerified) {
      return { success: true, message: "Login Successful" };
    }
    if (user && !user.isOtpVerified) {
      return {
        success: false,
        message: "Please Verify OTP First",
        redirect: "/otp",
      };
    }
    return {
      success: false,
      message: "Invalid Credentials",
    };
  }

  if ("email" in props && "password" in props) {
    const { email, password } = props;
    const user = await User.findOne({ email, password });
    if (user) {
      return { success: true, message: "Login Successful" };
    } else {
      return {
        success: false,
        message: "Invalid Credentials",
      };
    }
    // // if (user && !user.isOtpVerified) {
    // if (user && !user.isOtpVerified) {
    //   return {
    //     success: false,
    //     message: "Please Verify OTP First",
    //     redirect: "/otp",
    //   };
    // } else {
    //   return {
    //     success: false,
    //     message: "Invalid Credentials",
    //   };
    // }
  }
};

const createAccount = async (props, res) => {
  const { userName, contactNumber, email, password } = props;



  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return {
      success: false,
      message: "Email already exists try with different Email",
    };
  }

  // const generateOTP = () => {
  //   const digits = "0123456789";
  //   let otp = "";
  //   for (let i = 0; i < 6; i++) {
  //     otp += digits[Math.floor(Math.random() * 10)];
  //   }
  //   return otp;
  // };

  // Function to send otp to the merchants email

  // const sendOTP = async (email, otp) => {
  //   const transporter = nodemailer.createTransport({
  //     service: "gmail",
  //     auth: {
  //       user: "raoali539@gmail.com",
  //       pass: "fjtpebpsabumzfym",
  //     },
  //     port: 465,
  //     secureConnection: false,
  //     tls: {
  //       rejectUnAuthorized: true,
  //     },
  //   });

  //   const mailOptions = {
  //     from: process.env.EMAIL_USERNAME,
  //     to: email,
  //     subject: "OTP for Password Reset",
  //     html:
  //       `Hi ${userName},\n\n` +
  //       `Your OTP for resetting your Mawaish Mandi Account is: ${otp}\n\n` +
  //       `If you did not request this,please ignore this email.\n`,
  //   };

  //   const info = await transporter.sendMail(mailOptions);

  //   console.log(`Email sent: ${info.response}`);
  // };

  // const otp = generateOTP();
  // const expiryTime = Date.now() + 600000; // 1 hour

  // Save token and expiry time to the database

  // const resetOTP = new Otp({
  //   email: email,
  //   contactNumber: contactNumber,
  //   userName: userName,
  //   otp: otp,
  //   expiresAt: expiryTime,
  // });

  // await resetOTP.save();

  // await sendOTP(email, otp);

  const newUser = new User({
    // otp,
    userName,
    contactNumber,
    email,
    password,
  });

  await newUser.save();

  return { success: true, message: "Enter OTP" };
};

const resendOtpHandler = async (email) => {
  const existingOtp = await Otp.findOne({ email });
  if (existingOtp) {
    return {
      success: false,
      message:
        "Otp already sent. Please check your email Or try again after 1 minute.",
    };
  }

  const generateOTP = () => {
    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < 6; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  };

  // Function to send otp to the merchants email

  const sendOTP = async (email, otp) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "raoali539@gmail.com",
        pass: "fjtpebpsabumzfym",
      },
      port: 465,
      secureConnection: false,
      tls: {
        rejectUnAuthorized: true,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "OTP for Password Reset",
      html:
        `Hi ${email},\n\n` +
        `Your OTP for resetting your Mawaish Mandi Account is: ${otp}\n\n` +
        `If you did not request this,please ignore this email.\n`,
    };

    const info = await transporter.sendMail(mailOptions);
  };

  const otp = generateOTP();
  const expiryTime = Date.now() + 600000; // 1 hour

  // Save token and expiry time to the database

  const resetOTP = new Otp({
    email: email,
    otp: otp,
    expiresAt: expiryTime,
  });

  await resetOTP.save();

  await sendOTP(email, otp);

  return { success: true, message: "OTP sent successfully" };
};

const authenticateOTP = async (props) => {
  const { otp } = props;
  const resetOTP = await Otp.findOne({ otp: otp });

  if (!resetOTP) {
    return { success: false, message: "Invalid OTP" };
  }

  if (resetOTP.expiresAt < Date.now()) {
    // Delete expired OTP from the database
    await Otp.findByIdAndDelete(resetOTP._id);
    return { success: false, message: "OTP expired Please Request OTP Again" };
  }

  // const token = jwt.sign(
  //   { userId: resetOTP.userId },
  //   process.env.JWT_SECRET,
  //   {
  //     expiresIn: process.env.JWT_EXPIRE,
  //   }
  // );

  // const tokenDoc = new Token({
  //   userId: resetOTP.userId,
  //   token: token,
  //   createdAt: new Date(),
  //   expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // token expires in 1 day
  // });

  // await tokenDoc.save();

  if (resetOTP) {
    const updateUserAuthField = await User.findOneAndUpdate({
      isOtpVerified: true,
    });
    if (updateUserAuthField) {
      await Otp.findByIdAndDelete(resetOTP._id);
      return {
        success: true,
        message: "OTP Verified Please Login to Continue",
      };
    }
  }
};

// service function section
const createProductHandler = async (props) => {
  const { name, description, price, imageUrl, category, userId } =
    props;
  const product = new Product({
    name,
    description,
    price,
    imageUrl,
    category,
    createdBy: userId,
    updatedBy: userId,
  });

  const savedProduct = await product.save();
  if (!savedProduct) {
    return { success: false, message: "Failed To Post Add" };
  } else {
    return { success: true, message: "Add Posted Successfully" };
  }
};

const productByCategoryHandler = async ({ category, skip }) => {
  // following is the algorithm to get all products from all possible sources
  // steps 1 check in redis memory
  // step 2 check in mongodb
  const findProducts = await Product.find({ category: category }).populate("category", "name image")
    //   .select("name description price")
    .skip(skip)
    .limit(10)
    .lean();

  // find query alwasy returns the array so check if result is empty or not.
  if (!findProducts.length > 0) {
    return { success: false, message: "No Products Found" };
  }

  // if all goes well return result back to controller
  return {
    success: true,
    products: findProducts,
  };
};

const getAllProductsHandler = async () => {
  const products = await Product.find().populate("category", "name image");
  if (products.length === 0) {
    return { success: false, message: "No Products Found" };
  } else {
    return { success: true, products: products };
  }
};
const getLowInStockHandler = async () => {
  try {
    const products = await Product.find({ stockAvailable: { $lt: 5 } }).populate("category", "name image");

    if (products.length === 0) {
      return { success: false, message: "No low-stock products found" };
    }

    return { success: true, products };
  } catch (error) {
    return { success: false, message: "Error fetching products", error };
  }
};
const getHighInStock = async () => {
  try {
    const products = await Product.find({ stockAvailable: { $gt: 5 } }).populate("category", "name image");

    if (products.length === 0) {
      return { success: false, message: "Stock Not Available more!" };
    }

    return { success: true, products };
  } catch (error) {
    return { success: false, message: "Error fetching products", error };
  }
};


const updateProductById = async (id, body) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return { success: false, message: "Product not found" };
    }

    return {
      success: true,
      message: "Product updated successfully",
      data: updated,
    };
  } catch (error) {
    console.error("Update Product Error:", error);
    return { success: false, message: "Failed to update product" };
  }
};

const deleteProductById = async (id) => {
  try {
    const deleted = await Product.findByIdAndDelete(
      id
    );

    if (!deleted) {
      return { success: false, message: "Product not found" };
    }

    return {
      success: true,
      message: "Product deleted (soft delete) successfully",
    };
  } catch (error) {
    console.error("Delete Product Error:", error);
    return { success: false, message: "Failed to delete product" };
  }
};

const getAllProductsByIdHandler = async (productId) => {
  console.log("Product ID:", productId);
  const findProducts = await Product.findOne({ _id: productId }).populate("category", "name image");

  if (!findProducts) {
    return { success: false, message: "No Products Found" };
  }
  findProducts.totalViews += 1;
  await findProducts.save();

  return {
    success: true,
    products: findProducts,
  };
};

const productByPriceRangeHandler = async (minPrice, maxPrice) => {
  try {
    const products = await Product.find({
      price: { $gte: minPrice, $lte: maxPrice }
    }).populate("category", "name image");

    return { success: true, data: products };
  } catch (error) {
    console.error("Get Products by Price Range Error:", error);
    return { success: false, message: "Failed to fetch products by price range" };
  }
};
const productByCategoryAndPriceHandler = async (category, minPrice, maxPrice) => {
  try {
    const products = await Product.find({
      category,
      price: { $gte: minPrice, $lte: maxPrice },
    }).populate("category", "name image");

    return { success: true, data: products };
  } catch (error) {
    console.error("Get Products by Category & Price Error:", error);
    return { success: false, message: "Failed to fetch filtered products" };
  }
};

const createAccountWithGoogle = async (props) => {
  const { name, sub, email, picture } = props;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return {
      success: true,
      message: "Loged in successfully",
    };
  } else {
    const generatedPassword = Math.random().toString(36).slice(-8);
    const user = new User({
      userName: name,
      sub: sub,
      email: email,
      profilePicture: picture,
      password: generatedPassword,
      origin: 'Google_Authentication'
    });
    await user.save();
    return {
      success: true,
      message: "User created successfully",
    };
  }
};

//Category
const createCategoryHandler = async (body, res) => {
  try {
    const { name, image } = body;

    if (!name || !image) {
      return { success: false, message: "Name and image are required" };
    }

    const category = new Category({ name, image });
    await category.save();

    return { success: true, message: "Category created successfully", data: category };
  } catch (error) {
    console.error("Create Category Error:", error);
    return { success: false, message: "Failed to create category" };
  }
};

const updateCategoryById = async (id, body) => {
  try {
    const { name, image } = body;

    const updated = await Category.findByIdAndUpdate(
      id,
      { name, image },
      { new: true }
    );

    if (!updated) return { success: false, message: "Category not found" };

    return { success: true, message: "Category updated", data: updated };
  } catch (error) {
    console.error("Update Category Error:", error);
    return { success: false, message: "Failed to update category" };
  }
};

const deleteCategoryById = async (id) => {
  try {
    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) return { success: false, message: "Category not found" };

    return { success: true, message: "Category deleted" };
  } catch (error) {
    console.error("Delete Category Error:", error);
    return { success: false, message: "Failed to delete category" };
  }
};

const getAllCategoriesHandler = async () => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return { success: true, data: categories };
  } catch (error) {
    console.error("Get All Categories Error:", error);
    return { success: false, message: "Failed to fetch categories" };
  }
};
