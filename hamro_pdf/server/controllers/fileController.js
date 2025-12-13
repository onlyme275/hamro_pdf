// controllers/fileController.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { File } = require("../models");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/user-files");
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Upload file
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { userId } = req.body;

    if (!userId) {
      // Delete uploaded file if userId is missing
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "User ID is required" });
    }

    const file = await File.create({
      userId,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
    });

    res.status(201).json({
      message: "File uploaded successfully",
      file,
    });
  } catch (error) {
    console.error("❌ Upload file error:", error);
    
    // Delete uploaded file if database save fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      message: "Failed to upload file",
      error: error.message,
    });
  }
};

// Get all files for a user
const getUserFiles = async (req, res) => {
  try {
    const { userId } = req.params;

    const files = await File.findAll({
      where: { userId },
      order: [["uploadedAt", "DESC"]],
    });

    res.status(200).json({
      message: "Files retrieved successfully",
      files,
    });
  } catch (error) {
    console.error("❌ Get user files error:", error);
    res.status(500).json({
      message: "Failed to retrieve files",
      error: error.message,
    });
  }
};

// Get file by ID
const getFileById = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await File.findOne({ where: { id: fileId } });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.status(200).json({
      message: "File retrieved successfully",
      file,
    });
  } catch (error) {
    console.error("❌ Get file error:", error);
    res.status(500).json({
      message: "Failed to retrieve file",
      error: error.message,
    });
  }
};

// Download file
const downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await File.findOne({ where: { id: fileId } });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Check if file exists on disk
    if (!fs.existsSync(file.filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.download(file.filePath, file.fileName);
  } catch (error) {
    console.error("❌ Download file error:", error);
    res.status(500).json({
      message: "Failed to download file",
      error: error.message,
    });
  }
};

// View file (stream PDF)
const viewFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await File.findOne({ where: { id: fileId } });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Check if file exists on disk
    if (!fs.existsSync(file.filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    // Set proper headers for PDF viewing
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="' + file.fileName + '"');
    
    const fileStream = fs.createReadStream(file.filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("❌ View file error:", error);
    res.status(500).json({
      message: "Failed to view file",
      error: error.message,
    });
  }
};

// Update file (rename)
const updateFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { fileName } = req.body;

    if (!fileName) {
      return res.status(400).json({ message: "File name is required" });
    }

    const file = await File.findOne({ where: { id: fileId } });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Update file name in database
    const updated = await File.update(fileId, { fileName });

    if (!updated) {
      return res.status(500).json({ message: "Failed to update file" });
    }

    // Get updated file
    const updatedFile = await File.findOne({ where: { id: fileId } });

    res.status(200).json({
      message: "File updated successfully",
      file: updatedFile,
    });
  } catch (error) {
    console.error("❌ Update file error:", error);
    res.status(500).json({
      message: "Failed to update file",
      error: error.message,
    });
  }
};

// Delete file
const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await File.findOne({ where: { id: fileId } });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Delete file from disk first
    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }

    // Delete from database using static delete method
    const deleted = await File.delete(fileId);

    if (!deleted) {
      return res.status(500).json({ message: "Failed to delete file from database" });
    }

    res.status(200).json({
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete file error:", error);
    res.status(500).json({
      message: "Failed to delete file",
      error: error.message,
    });
  }
};

module.exports = {
  upload,
  uploadFile,
  getUserFiles,
  getFileById,
  downloadFile,
  viewFile,
  updateFile,
  deleteFile,
};