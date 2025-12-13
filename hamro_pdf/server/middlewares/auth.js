const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is active
    if (user.active === 0) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated",
      });
    }

    // Attach user to request object (without password)
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }
    
    return res.status(403).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }

  next();
};

// Middleware to check if user is premium or admin
const isPremiumOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (req.user.role !== "premium" && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Premium membership required.",
    });
  }

  next();
};

// Middleware to check if user can access resource (own resource or admin)
const canAccessResource = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const resourceUserId = req.params.id || req.body.id;
  
  // Allow if admin or accessing own resource
  if (req.user.role === "admin" || req.user.id === resourceUserId) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. You can only access your own resources.",
    });
  }
};

module.exports = {
  authenticateToken,
  isAdmin,
  isPremiumOrAdmin,
  canAccessResource,
};