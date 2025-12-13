const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class Signature {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.userId = data.userId;
    this.signatureName = data.signatureName;
    this.signatureType = data.signatureType; // 'draw', 'text', 'image'
    this.signatureData = data.signatureData; // Base64 for drawn/image, text for typed
    this.width = data.width;
    this.height = data.height;
    this.isDefault = data.isDefault || false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Create signatures table if it doesn't exist
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS signatures (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        signature_name VARCHAR(255) NOT NULL,
        signature_type ENUM('draw', 'text', 'image') NOT NULL,
        signature_data TEXT NOT NULL,
        width INT DEFAULT NULL,
        height INT DEFAULT NULL,
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_user_default (user_id, is_default)
      )
    `;

    try {
      const [result, _] = await db.execute(query);
      return result;
    } catch (error) {
      console.error("Error creating signatures table:", error);
      throw error;
    }
  }

  // Save signature to database
  async save() {
    const query = `
      INSERT INTO signatures 
      (id, user_id, signature_name, signature_type, signature_data, width, height, is_default, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const values = [
      this.id,
      this.userId,
      this.signatureName,
      this.signatureType,
      this.signatureData,
      this.width,
      this.height,
      this.isDefault,
    ];

    try {
      const [result, _] = await db.execute(query, values);
      return this;
    } catch (error) {
      console.error("Error saving signature:", error);
      throw error;
    }
  }

  // Find signature by ID
  static async findById(id) {
    try {
      const query = "SELECT * FROM signatures WHERE id = ?";
      const [result, _] = await db.execute(query, [id]);

      if (result.length === 0) {
        return null;
      }

      const data = this.mapDbRowToObject(result[0]);
      return new Signature(data);
    } catch (error) {
      console.error("Error finding signature by id:", error);
      throw error;
    }
  }

  // Find all signatures for a user
  static async findByUserId(userId) {
    try {
      const query =
        "SELECT * FROM signatures WHERE user_id = ? ORDER BY is_default DESC, created_at DESC";
      const [result, _] = await db.execute(query, [userId]);

      return result.map((row) => {
        const data = this.mapDbRowToObject(row);
        return new Signature(data);
      });
    } catch (error) {
      console.error("Error finding signatures by user id:", error);
      throw error;
    }
  }

  // Get user's default signature
  static async findDefaultByUserId(userId) {
    try {
      const query =
        "SELECT * FROM signatures WHERE user_id = ? AND is_default = TRUE LIMIT 1";
      const [result, _] = await db.execute(query, [userId]);

      if (result.length === 0) {
        return null;
      }

      const data = this.mapDbRowToObject(result[0]);
      return new Signature(data);
    } catch (error) {
      console.error("Error finding default signature:", error);
      throw error;
    }
  }

  // Update signature
  async update(updateData) {
    try {
      // Check if updateData object is empty
      if (Object.keys(updateData).length === 0) {
        throw new Error("No fields to update");
      }

      const allowedFields = [
        "signature_name",
        "signature_data",
        "width",
        "height",
        "is_default",
      ];
      const fieldsToUpdate = {};

      // Convert camelCase to snake_case and filter allowed fields
      Object.keys(updateData).forEach((key) => {
        const snakeKey = this.camelToSnake(key);
        if (allowedFields.includes(snakeKey)) {
          fieldsToUpdate[snakeKey] = updateData[key];
          this[key] = updateData[key]; // Update instance property
        }
      });

      // Always update the updated_at field
      fieldsToUpdate.updated_at = "NOW()";

      // Construct the SET clause
      const updates = Object.entries(fieldsToUpdate)
        .map(([key, value]) =>
          value === "NOW()" ? `${key} = NOW()` : `${key} = ?`
        )
        .join(", ");

      // Prepare the values array (excluding NOW() values)
      const values = Object.entries(fieldsToUpdate)
        .filter(([key, value]) => value !== "NOW()")
        .map(([key, value]) => value);

      values.push(this.id); // Add id for WHERE clause

      const query = `UPDATE signatures SET ${updates} WHERE id = ?`;
      const [result, _] = await db.execute(query, values);

      return this;
    } catch (error) {
      console.error("Error updating signature:", error);
      throw error;
    }
  }

  // Set as default signature (unset others for the user)
  async setAsDefault() {
    try {
      // First, unset all default signatures for this user
      const unsetQuery =
        "UPDATE signatures SET is_default = FALSE WHERE user_id = ?";
      await db.execute(unsetQuery, [this.userId]);

      // Then set this signature as default
      const setQuery =
        "UPDATE signatures SET is_default = TRUE, updated_at = NOW() WHERE id = ?";
      await db.execute(setQuery, [this.id]);

      this.isDefault = true;
      return this;
    } catch (error) {
      console.error("Error setting default signature:", error);
      throw error;
    }
  }

  // Delete signature
  async delete() {
    try {
      const query = "DELETE FROM signatures WHERE id = ?";
      const [result, _] = await db.execute(query, [this.id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error deleting signature:", error);
      throw error;
    }
  }

  // Get all signatures (admin function)
  static async findAll() {
    try {
      const query = "SELECT * FROM signatures ORDER BY created_at DESC";
      const [result, _] = await db.execute(query);

      return result.map((row) => {
        const data = this.mapDbRowToObject(row);
        return new Signature(data);
      });
    } catch (error) {
      console.error("Error finding all signatures:", error);
      throw error;
    }
  }

  // Count signatures for a user
  static async countByUserId(userId) {
    try {
      const query =
        "SELECT COUNT(*) as count FROM signatures WHERE user_id = ?";
      const [result, _] = await db.execute(query, [userId]);
      return result[0].count;
    } catch (error) {
      console.error("Error counting signatures:", error);
      throw error;
    }
  }

  // Soft delete signature (mark as inactive instead of deleting)
  async softDelete() {
    try {
      const query =
        "UPDATE signatures SET is_default = FALSE, updated_at = NOW() WHERE id = ?";
      const [result, _] = await db.execute(query, [this.id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error soft deleting signature:", error);
      throw error;
    }
  }

  // Helper method to map database row to object
  static mapDbRowToObject(row) {
    return {
      id: row.id,
      userId: row.user_id,
      signatureName: row.signature_name,
      signatureType: row.signature_type,
      signatureData: row.signature_data,
      width: row.width,
      height: row.height,
      isDefault: Boolean(row.is_default),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // Helper method to convert camelCase to snake_case
  camelToSnake(str) {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }

  // Convert to JSON for API responses
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      signatureName: this.signatureName,
      signatureType: this.signatureType,
      signatureData: this.signatureData,
      width: this.width,
      height: this.height,
      isDefault: this.isDefault,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Signature;
