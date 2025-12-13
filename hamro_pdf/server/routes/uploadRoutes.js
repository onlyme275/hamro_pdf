// routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");
const { authenticateToken, isAdmin } = require("../middlewares/auth");

// Upload image (admin only)
router.post("/image", authenticateToken, isAdmin, uploadController.uploadImage);

// Delete image (admin only)
router.delete(
  "/image/:filename",
  authenticateToken,
  isAdmin,
  uploadController.deleteImage
);

module.exports = router;
