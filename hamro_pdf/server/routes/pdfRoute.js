// routes/pdfRoute.js - SIMPLE & CLEAN
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  analyzePdf,
  generateExcel,
  downloadExcel,
} = require("../controllers/pdfController");

const router = express.Router();

// Create upload directory
const uploadDir = path.join(__dirname, "../uploads/temp");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/temp/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "pdf-" + uniqueSuffix + ".pdf");
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files allowed"), false);
    }
  },
});

// === ROUTES ===

// 1. Analyze PDF and extract table
router.post("/analyze", upload.single("pdf"), analyzePdf);

// 2. Generate Excel with selected columns
router.post("/generate", generateExcel);

// 3. Download Excel file
router.get("/download/:filename", downloadExcel);

// Test route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "PDF to Excel API is running",
    endpoints: {
      analyze: "POST /api/pdf/analyze",
      generate: "POST /api/pdf/generate",
      download: "GET /api/pdf/download/:filename",
    },
  });
});

module.exports = router;
