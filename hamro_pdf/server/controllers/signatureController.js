// FILE: server/controllers/signatureController.js
// 100% COMPLETE CODE - NO TRUNCATION

const { validationResult } = require("express-validator");
const Signature = require("../models/signatureModel");

class SignatureController {
  // Initialize signatures table (for setup)
  static async initializeTable(req, res) {
    try {
      await Signature.createTable();
      
      return res.status(200).json({
        success: true,
        message: "Signatures table initialized successfully",
      });
    } catch (error) {
      console.error("Error initializing signatures table:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to initialize signatures table",
        error: error.message,
      });
    }
  }

  // Create a new signature
  static async createSignature(req, res) {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const {
        signatureName,
        signatureType,
        signatureData,
        width,
        height,
        isDefault = false,
      } = req.body;

      const userId = req.user.id;

      // If this signature should be default, unset other defaults
      if (isDefault) {
        const existingSignatures = await Signature.findByUserId(userId);
        for (const sig of existingSignatures) {
          if (sig.isDefault) {
            await sig.update({ isDefault: false });
          }
        }
      }

      // Create new signature
      const signature = new Signature({
        userId,
        signatureName,
        signatureType,
        signatureData,
        width,
        height,
        isDefault,
      });

      await signature.save();

      return res.status(201).json({
        success: true,
        message: "Signature created successfully",
        data: signature.toJSON(),
      });
    } catch (error) {
      console.error("Error creating signature:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create signature",
        error: error.message,
      });
    }
  }

  // Get all signatures for authenticated user
  static async getUserSignatures(req, res) {
    try {
      const userId = req.user.id;
      const signatures = await Signature.findByUserId(userId);

      return res.status(200).json({
        success: true,
        count: signatures.length,
        data: signatures.map(sig => sig.toJSON()),
      });
    } catch (error) {
      console.error("Error fetching user signatures:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch signatures",
        error: error.message,
      });
    }
  }

  // Get user's default signature
  static async getDefaultSignature(req, res) {
    try {
      const userId = req.user.id;
      const signature = await Signature.findDefaultByUserId(userId);

      if (!signature) {
        return res.status(404).json({
          success: false,
          message: "No default signature found",
        });
      }

      return res.status(200).json({
        success: true,
        data: signature.toJSON(),
      });
    } catch (error) {
      console.error("Error fetching default signature:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch default signature",
        error: error.message,
      });
    }
  }

  // Get a specific signature by ID
  static async getSignatureById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const signature = await Signature.findById(id);

      if (!signature) {
        return res.status(404).json({
          success: false,
          message: "Signature not found",
        });
      }

      // Check if signature belongs to user
      if (signature.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      return res.status(200).json({
        success: true,
        data: signature.toJSON(),
      });
    } catch (error) {
      console.error("Error fetching signature:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch signature",
        error: error.message,
      });
    }
  }

  // Update a signature
  static async updateSignature(req, res) {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const userId = req.user.id;
      const { signatureName, signatureData, width, height, isDefault } = req.body;

      // Find signature
      const signature = await Signature.findById(id);

      if (!signature) {
        return res.status(404).json({
          success: false,
          message: "Signature not found",
        });
      }

      // Check if signature belongs to user
      if (signature.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      // If setting as default, unset other defaults
      if (isDefault === true) {
        const userSignatures = await Signature.findByUserId(userId);
        for (const sig of userSignatures) {
          if (sig.id !== id && sig.isDefault) {
            await sig.update({ isDefault: false });
          }
        }
      }

      // Build update data
      const updateData = {};
      if (signatureName !== undefined) updateData.signatureName = signatureName;
      if (signatureData !== undefined) updateData.signatureData = signatureData;
      if (width !== undefined) updateData.width = width;
      if (height !== undefined) updateData.height = height;
      if (isDefault !== undefined) updateData.isDefault = isDefault;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: "No fields to update",
        });
      }

      await signature.update(updateData);

      return res.status(200).json({
        success: true,
        message: "Signature updated successfully",
        data: signature.toJSON(),
      });
    } catch (error) {
      console.error("Error updating signature:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update signature",
        error: error.message,
      });
    }
  }

  // Set a signature as default
  static async setDefaultSignature(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Find signature
      const signature = await Signature.findById(id);

      if (!signature) {
        return res.status(404).json({
          success: false,
          message: "Signature not found",
        });
      }

      // Check if signature belongs to user
      if (signature.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      // Set as default
      await signature.setAsDefault();

      return res.status(200).json({
        success: true,
        message: "Default signature updated successfully",
        data: signature.toJSON(),
      });
    } catch (error) {
      console.error("Error setting default signature:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to set default signature",
        error: error.message,
      });
    }
  }

  // Delete a signature
  static async deleteSignature(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Find signature
      const signature = await Signature.findById(id);

      if (!signature) {
        return res.status(404).json({
          success: false,
          message: "Signature not found",
        });
      }

      // Check if signature belongs to user
      if (signature.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      // Delete the signature
      await signature.delete();

      return res.status(200).json({
        success: true,
        message: "Signature deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting signature:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete signature",
        error: error.message,
      });
    }
  }

  // Get signature count for user
  static async getUserSignatureCount(req, res) {
    try {
      const userId = req.user.id;
      const count = await Signature.countByUserId(userId);

      return res.status(200).json({
        success: true,
        count: count,
      });
    } catch (error) {
      console.error("Error counting signatures:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to count signatures",
        error: error.message,
      });
    }
  }
}

module.exports = SignatureController;