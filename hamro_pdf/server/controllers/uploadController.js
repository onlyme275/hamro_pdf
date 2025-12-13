// controllers/uploadController.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads/splash");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Created uploads/splash directory");
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/splash");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, "splash-" + uniqueSuffix + ext);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, PNG, GIF, WebP) are allowed!"));
  }
};

// Configure multer - EXPORT THIS for use as middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter,
});

// Export the upload middleware
exports.upload = upload;

// Standalone upload endpoint (if you want a dedicated upload route)
exports.uploadImage = async (req, res) => {
  try {
    console.log("📤 Upload request received");
    console.log("File:", req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No image file provided",
      });
    }

    // Construct the image URL
    const filePath = req.file.path.replace(/\\/g, "/");
    const imageUrl = `${req.protocol}://${req.get("host")}/${filePath}`;

    console.log("✅ Image uploaded successfully:", imageUrl);

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: imageUrl,
      url: imageUrl,
      filename: req.file.filename,
      path: filePath,
    });
  } catch (error) {
    console.error("❌ Error uploading image:", error);

    // Clean up file if it was uploaded
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      error: error.message || "Failed to upload image",
    });
  }
};

// Delete image
exports.deleteImage = async (req, res) => {
  try {
    const { filename } = req.params;
    const imagePath = path.join(__dirname, "../uploads/splash", filename);

    console.log("🗑️ Attempting to delete:", imagePath);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log("✅ Image deleted successfully");
      res.json({
        success: true,
        message: "Image deleted successfully",
      });
    } else {
      console.log("❌ Image not found");
      res.status(404).json({
        success: false,
        error: "Image not found",
      });
    }
  } catch (error) {
    console.error("❌ Error deleting image:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete image",
    });
  }
};
