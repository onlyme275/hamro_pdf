// routes/adRoutes.js
const express = require("express");
const {
  createAd,
  getAllAds,
  getActiveAdByPlacement,
  getAdById,
  updateAd,
  deleteAd,
  trackImpression,
  trackClick,
  getAdStats,
} = require("../controllers/adController");
const { upload } = require("../controllers/uploadController");
const { authenticateToken, isAdmin } = require("../middlewares/auth");

const router = express.Router();

// Public routes
// Get active ad by placement (home, dashboard, tools, etc.)
router.get("/placement/:placement", getActiveAdByPlacement);

// Track impression (can be public or authenticated)
router.post("/:adId/impression", trackImpression);

// Track click (can be public or authenticated)
router.post("/:adId/click", trackClick);

// Admin routes
// Create ad with image upload
router.post("/", authenticateToken, isAdmin, upload.single("image"), createAd);

// Get all ads (admin)
router.get("/", authenticateToken, isAdmin, getAllAds);

// Get ad statistics
router.get("/:adId/stats", authenticateToken, isAdmin, getAdStats);

// Get ad by ID
router.get("/:adId", authenticateToken, isAdmin, getAdById);

// Update ad with optional image upload
router.put(
  "/:adId",
  authenticateToken,
  isAdmin,
  upload.single("image"),
  updateAd
);

// Delete ad
router.delete("/:adId", authenticateToken, isAdmin, deleteAd);

module.exports = router;
