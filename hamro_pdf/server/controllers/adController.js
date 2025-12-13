// server/controllers/adController.js
const Ad = require("../models/Ad.js");
const fs = require("fs");
const path = require("path");

// Create a new ad
exports.createAd = async (req, res) => {
  try {
    const data = {
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      linkUrl: req.body.linkUrl,
      placement: req.body.placement,
      position: req.body.position,
      width: req.body.width,
      height: req.body.height,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      startDate: req.body.startDate || null,
      endDate: req.body.endDate || null,
      createdBy: req.user.id, // assuming req.user is set after auth middleware
    };

    const ad = await Ad.create(data);
    res.status(201).json({ success: true, ad });
  } catch (error) {
    console.error("❌ Create ad error:", error);
    res.status(500).json({ success: false, message: "Failed to create ad", error: error.message });
  }
};

// Get all ads with optional filters
exports.getAllAds = async (req, res) => {
  try {
    const conditions = {
      where: {
        placement: req.query.placement,
        isActive: req.query.isActive !== undefined ? req.query.isActive === "true" : undefined,
        createdBy: req.query.createdBy,
      },
      order: [["createdAt", "DESC"]],
    };

    const ads = await Ad.findAll(conditions);
    res.status(200).json({ success: true, ads });
  } catch (error) {
    console.error("❌ Get all ads error:", error);
    res.status(500).json({ success: false, message: "Failed to get ads", error: error.message });
  }
};

// Get a single ad by ID
exports.getAdById = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ success: false, message: "Ad not found" });
    res.status(200).json({ success: true, ad });
  } catch (error) {
    console.error("❌ Get ad error:", error);
    res.status(500).json({ success: false, message: "Failed to get ad", error: error.message });
  }
};

// Update an ad
exports.updateAd = async (req, res) => {
  try {
    const updated = await Ad.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Ad not found or no fields to update" });
    const ad = await Ad.findById(req.params.id);
    res.status(200).json({ success: true, ad });
  } catch (error) {
    console.error("❌ Update ad error:", error);
    res.status(500).json({ success: false, message: "Failed to update ad", error: error.message });
  }
};

// Delete an ad
exports.deleteAd = async (req, res) => {
  try {
    const deleted = await Ad.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Ad not found" });
    res.status(200).json({ success: true, message: "Ad deleted successfully" });
  } catch (error) {
    console.error("❌ Delete ad error:", error);
    res.status(500).json({ success: false, message: "Failed to delete ad", error: error.message });
  }
};

// Get one active ad by placement
exports.getActiveAdByPlacement = async (req, res) => {
  try {
    const ad = await Ad.getActiveByPlacement(req.params.placement);
    if (!ad) return res.status(404).json({ success: false, message: "No active ad found for this placement" });
    res.status(200).json({ success: true, ad });
  } catch (error) {
    console.error("❌ Get active ad error:", error);
    res.status(500).json({ success: false, message: "Failed to get active ad", error: error.message });
  }
};

// Track impression
exports.trackImpression = async (req, res) => {
  try {
    await Ad.trackImpression(req.params.id, req.user?.id, req.ip);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Track impression error:", error);
    res.status(500).json({ success: false, message: "Failed to track impression", error: error.message });
  }
};

// Track click
exports.trackClick = async (req, res) => {
  try {
    await Ad.trackClick(req.params.id, req.user?.id, req.ip, req.headers["user-agent"]);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Track click error:", error);
    res.status(500).json({ success: false, message: "Failed to track click", error: error.message });
  }
};

// Get stats
exports.getAdStats = async (req, res) => {
  try {
    const stats = await Ad.getStats(req.params.id);
    res.status(200).json({ success: true, stats });
  } catch (error) {
    console.error("❌ Get stats error:", error);
    res.status(500).json({ success: false, message: "Failed to get ad stats", error: error.message });
  }
};
