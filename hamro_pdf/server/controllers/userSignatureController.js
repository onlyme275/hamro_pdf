// controllers/userSignatureController.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { UserSignature } = require("../models");

// Configure multer for signature upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/user-signatures");
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  // Accept image files only
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
});

// Upload signature
const uploadSignature = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No signature uploaded" });
    }

    const { userId } = req.body;

    if (!userId) {
      // Delete uploaded file if userId is missing
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "User ID is required" });
    }

    // Create URL for the signature
    const signatureUrl = `/uploads/user-signatures/${req.file.filename}`;

    const signature = await UserSignature.create({
      userId,
      signatureUrl,
      filePath: req.file.path,
    });

    res.status(201).json({
      message: "Signature uploaded successfully",
      signature,
    });
  } catch (error) {
    console.error("❌ Upload signature error:", error);
    
    // Delete uploaded file if database save fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      message: "Failed to upload signature",
      error: error.message,
    });
  }
};

// Get all signatures for a user
const getUserSignatures = async (req, res) => {
  try {
    const { userId } = req.params;

    const signatures = await UserSignature.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "Signatures retrieved successfully",
      signatures,
    });
  } catch (error) {
    console.error("❌ Get user signatures error:", error);
    res.status(500).json({
      message: "Failed to retrieve signatures",
      error: error.message,
    });
  }
};

// Get signature by ID
const getSignatureById = async (req, res) => {
  try {
    const { signatureId } = req.params;

    const signature = await UserSignature.findOne({ where: { id: signatureId } });

    if (!signature) {
      return res.status(404).json({ message: "Signature not found" });
    }

    res.status(200).json({
      message: "Signature retrieved successfully",
      signature,
    });
  } catch (error) {
    console.error("❌ Get signature error:", error);
    res.status(500).json({
      message: "Failed to retrieve signature",
      error: error.message,
    });
  }
};

// View signature (stream image)
const viewSignature = async (req, res) => {
  try {
    const { signatureId } = req.params;

    const signature = await UserSignature.findOne({ where: { id: signatureId } });

    if (!signature) {
      return res.status(404).json({ message: "Signature not found" });
    }

    // Check if file exists on disk
    if (!fs.existsSync(signature.filePath)) {
      return res.status(404).json({ message: "Signature file not found on server" });
    }

    // Get file extension to determine content type
    const ext = path.extname(signature.filePath).toLowerCase();
    const contentTypeMap = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml'
    };

    const contentType = contentTypeMap[ext] || 'image/png';
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', 'inline');
    
    const fileStream = fs.createReadStream(signature.filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("❌ View signature error:", error);
    res.status(500).json({
      message: "Failed to view signature",
      error: error.message,
    });
  }
};

// Update signature (replace with new image)
const updateSignature = async (req, res) => {
  try {
    const { signatureId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No signature file uploaded" });
    }

    const signature = await UserSignature.findOne({ where: { id: signatureId } });

    if (!signature) {
      // Delete newly uploaded file since signature doesn't exist
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: "Signature not found" });
    }

    // Delete old signature file from disk
    if (fs.existsSync(signature.filePath)) {
      fs.unlinkSync(signature.filePath);
    }

    // Create new URL for the signature
    const newSignatureUrl = `/uploads/user-signatures/${req.file.filename}`;

    // Update signature in database
    const updated = await UserSignature.update(signatureId, {
      signatureUrl: newSignatureUrl,
      filePath: req.file.path,
    });

    if (!updated) {
      // If update fails, delete the new file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(500).json({ message: "Failed to update signature" });
    }

    // Get updated signature
    const updatedSignature = await UserSignature.findOne({ where: { id: signatureId } });

    res.status(200).json({
      message: "Signature updated successfully",
      signature: updatedSignature,
    });
  } catch (error) {
    console.error("❌ Update signature error:", error);
    
    // Delete uploaded file if update fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      message: "Failed to update signature",
      error: error.message,
    });
  }
};

// Delete signature
const deleteSignature = async (req, res) => {
  try {
    const { signatureId } = req.params;

    const signature = await UserSignature.findOne({ where: { id: signatureId } });

    if (!signature) {
      return res.status(404).json({ message: "Signature not found" });
    }

    // Delete file from disk first
    if (fs.existsSync(signature.filePath)) {
      fs.unlinkSync(signature.filePath);
    }

    // Delete from database using static delete method
    const deleted = await UserSignature.delete(signatureId);

    if (!deleted) {
      return res.status(500).json({ message: "Failed to delete signature from database" });
    }

    res.status(200).json({
      message: "Signature deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete signature error:", error);
    res.status(500).json({
      message: "Failed to delete signature",
      error: error.message,
    });
  }
};

module.exports = {
  upload,
  uploadSignature,
  getUserSignatures,
  getSignatureById,
  viewSignature,
  updateSignature,
  deleteSignature,
};