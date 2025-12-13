require("dotenv").config();
const express = require("express");
const passport = require("passport");
require("./config/passport-config");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

// Existing routes
const pdfRoute = require("./routes/pdfRoute");
const userRoute = require("./routes/userRoute");
const excelRoute = require("./routes/excelRoute");
const pdfProtectRoute = require("./routes/pdfProtectRoute");
const pdfOrganizeRoute = require("./routes/pdfOrganizeRoute");
const signatureRoute = require("./routes/signatureRoute");
const splashRoute = require("./routes/splashRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const adRoutes = require("./routes/adRoutes");

// New routes for file management
const fileRoutes = require("./routes/fileRoutes");
const userSignatureRoutes = require("./routes/userSignatureRoutes");

const app = express();
app.use(passport.initialize());

// Middleware
app.use(
  cors({
    origin: [process.env.FRONTEND, "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(morgan("tiny"));

// Static file serving for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Existing routes
app.use("/api/pdf", pdfRoute);
app.use("/api/user", userRoute);
app.use("/api/excel", excelRoute);
app.use("/api/pdf-protect", pdfProtectRoute);
app.use("/api/pdf-organize", pdfOrganizeRoute);
app.use("/api/signature", signatureRoute);
app.use("/api/splash", splashRoute);
app.use("/api/upload", uploadRoutes);
app.use("/api/ads", adRoutes);

// New routes for file and signature management
app.use("/api/files", fileRoutes);
app.use("/api/user-signatures", userSignatureRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  // Multer errors
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ 
        message: "File size is too large. Maximum size is 10MB for files and 2MB for signatures." 
      });
    }
    return res.status(400).json({ message: err.message });
  }

  // Other errors
  console.error("❌ Error:", err);
  res.status(500).json({ 
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

console.clear();
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
  console.log(`📁 File uploads directory: ${path.join(__dirname, "uploads")}`);
});