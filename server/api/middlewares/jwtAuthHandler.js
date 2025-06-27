const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Token Not Provided" });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // req.userId = decodedToken.userId;

    const user = await User.findById(decodedToken.userId).exec();
    // console.log("user",user);
    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    // console.log("User ID:", req.userId);
    // req.userRole = user.userRole;
    req.userId = user._id;
    // console.log("userRole is",  user.userRole);

    next();
  } catch (err) {
    console.error("Token Verification Error:", err.message);
    return res.status(401).json({ message: "Token has expired or been revoked. Please log in again." });
  }
}

module.exports = authMiddleware;
