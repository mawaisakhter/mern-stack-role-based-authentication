// const jwt = require("jsonwebtoken");

// const authenticate = (req, res, next) => {
//   const token = req.header("Authorization")?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "Access Denied" });

//   try {
//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = verified;
//     next();
//   } catch (err) {
//     res.status(400).json({ message: "Invalid Token" });
//   }
// };

// module.exports = authenticate;

// const jwt = require("jsonwebtoken");
// const BlacklistedToken = require("../models/BlacklistedToken");
// require("dotenv").config();

// const authenticate = async (req, res, next) => {
//   const token = req.header("Authorization")?.split(" ")[1];
//   if (!token) {
//     return res.status(401).json({ success: false, message: "Access Denied. No token provided." });
//   }

//   try {
//     // Check if the token is blacklisted
//     const blacklistedToken = await BlacklistedToken.findOne({ token });
//     if (blacklistedToken) {
//       return res.status(401).json({ success: false, message: "Token has been invalidated. Please log in again." });
//     }

//     // Verify the token
//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = verified;
//     next();
//   } catch (err) {
//     res.status(400).json({ success: false, message: "Back Invalid or expired token." });
//   }
// };

// module.exports = authenticate;

const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../models/BlacklistedToken");
require("dotenv").config();

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Access Denied. No token provided." });
  }

  try {
    // Check if the token is blacklisted
    const blacklistedToken = await BlacklistedToken.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({ success: false, message: "Token has been invalidated. Please log in again." });
    }

    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired. Please log in again." });
    }
    return res.status(400).json({ success: false, message: "Invalid token." });
  }
};

module.exports = authenticate;



