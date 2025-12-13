// routes/userSignatureRoutes.js
const express = require("express");
const {
  upload,
  uploadSignature,
  getUserSignatures,
  deleteSignature,
  getSignatureById,
} = require("../controllers/userSignatureController");
const { authenticateToken } = require("../middlewares/auth");

const router = express.Router();

// Upload signature
router.post("/upload", authenticateToken, upload.single("signature"), uploadSignature);

// Get all signatures for a user
router.get("/user/:userId", authenticateToken, getUserSignatures);

// Get signature by ID
router.get("/:signatureId", authenticateToken, getSignatureById);

// Delete signature
router.delete("/:signatureId", authenticateToken, deleteSignature);

module.exports = router;
