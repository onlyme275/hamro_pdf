const express = require("express");
const router = express.Router();
const splashController = require("../controllers/splashController");
const { authenticateToken, isAdmin } = require("../middlewares/auth");

// ============= PUBLIC ROUTES =============
// Get active splash screens (for displaying to users)
router.get("/active", splashController.getActiveSplash);

// ============= ADMIN ROUTES - ORDER MATTERS! =============
// IMPORTANT: More specific routes must come BEFORE generic ones

// Get splash screen statistics (admin dashboard) - MUST come before /:id
router.get(
  "/admin/stats",
  authenticateToken,
  isAdmin,
  splashController.getSplashStats
);

// Update display orders for multiple splash screens (admin only)
router.patch(
  "/update-orders",
  authenticateToken,
  isAdmin,
  splashController.updateDisplayOrders
);

// Bulk update status for multiple splash screens (admin only)
router.patch(
  "/bulk-status",
  authenticateToken,
  isAdmin,
  splashController.bulkUpdateStatus
);

// Get all splash screens (admin only)
router.get("/", authenticateToken, isAdmin, splashController.getAllSplash);

// Create new splash screen (admin only)
router.post("/", authenticateToken, isAdmin, splashController.createSplash);

// Toggle splash screen active status (admin only) - MUST come before /:id
router.patch(
  "/:id/toggle-status",
  authenticateToken,
  isAdmin,
  splashController.toggleSplashStatus
);

// Get splash screen by ID (public view) - MUST come after more specific routes
router.get("/:id", splashController.getSplashById);

// Update splash screen (admin only)
router.put("/:id", authenticateToken, isAdmin, splashController.updateSplash);

// Delete splash screen (admin only)
router.delete(
  "/:id",
  authenticateToken,
  isAdmin,
  splashController.deleteSplash
);

// ============= DEBUG ROUTES =============
// Debug route to check table structure (admin only)
router.get(
  "/debug/table-structure",
  authenticateToken,
  isAdmin,
  splashController.getTableStructure
);

module.exports = router;
