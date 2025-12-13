const passport = require("passport");


const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const { authenticateToken, isAdmin } = require("../middlewares/auth");

// Public routes (no authentication required)
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: process.env.FRONTEND + "/login?error=google_auth_failed",
  }),
  UserController.googleCallback
);

// Protected routes (authentication required)
router.get("/:id", authenticateToken, UserController.getUserById);
router.post("/change-password", authenticateToken, UserController.changePassword);
router.put("/:id", authenticateToken, UserController.updateUser);

// Admin only routes
router.get("/", authenticateToken, isAdmin, UserController.getAllUsers);
router.post("/add", authenticateToken, isAdmin, UserController.addUser);
router.delete("/:id", authenticateToken, isAdmin, UserController.deleteUser);
router.post("/deactivate/:id", authenticateToken, isAdmin, UserController.deactivateUser);
router.post("/reset-password", authenticateToken, isAdmin, UserController.resetPassword);

// Image upload route (with multer middleware)
// router.put("/:id/image", authenticateToken, upload.single('image'), UserController.updateImage);

module.exports = router;