// routes/fileRoutes.js
const express = require("express");
const {
  upload,
  uploadFile,
  getUserFiles,
  downloadFile,
  viewFile,
  deleteFile,
  getFileById,
} = require("../controllers/fileController");
const { authenticateToken } = require("../middlewares/auth");

const router = express.Router();

// Upload file
router.post("/upload", authenticateToken, upload.single("file"), uploadFile);

// Get all files for a user
router.get("/user/:userId", authenticateToken, getUserFiles);

// Download file
router.get("/download/:fileId", authenticateToken, downloadFile);

// View file (stream)
router.get("/view/:fileId", authenticateToken, viewFile);

// Get file by ID
router.get("/:fileId", authenticateToken, getFileById);

// Delete file
router.delete("/:fileId", authenticateToken, deleteFile);

module.exports = router;
