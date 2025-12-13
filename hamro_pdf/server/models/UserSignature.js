// models/UserSignature.js
const { v4: uuidv4 } = require("uuid");
const db = require("../config/database");

class UserSignature {
  constructor(userId, signatureUrl, filePath) {
    this.id = uuidv4();
    this.userId = userId;
    this.signatureUrl = signatureUrl;
    this.filePath = filePath;
  }

  async save() {
    try {
      const sql = `INSERT INTO user_signatures (id, user_id, signature_url, file_path, created_at) 
                   VALUES (?, ?, ?, ?, NOW())`;
      const [result] = await db.execute(sql, [
        this.id,
        this.userId,
        this.signatureUrl,
        this.filePath,
      ]);
      return this;
    } catch (error) {
      console.error("Error saving signature:", error);
      throw error;
    }
  }

  static async create(data) {
    const signature = new UserSignature(
      data.userId,
      data.signatureUrl,
      data.filePath
    );
    await signature.save();
    return signature;
  }

  static async findAll(conditions = {}) {
    try {
      const { where, order } = conditions;
      let sql = `SELECT 
                   id, 
                   user_id as userId, 
                   signature_url as signatureUrl, 
                   file_path as filePath,
                   created_at as createdAt
                 FROM user_signatures`;
      const params = [];

      if (where && where.userId) {
        sql += ` WHERE user_id = ?`;
        params.push(where.userId);
      }

      // Handle custom ordering or default
      if (order && order.length > 0) {
        const [field, direction] = order[0];
        const dbField = field === 'createdAt' ? 'created_at' : field;
        sql += ` ORDER BY ${dbField} ${direction || 'DESC'}`;
      } else {
        sql += ` ORDER BY created_at DESC`;
      }

      const [rows] = await db.execute(sql, params);
      return rows;
    } catch (error) {
      console.error("Error finding signatures:", error);
      throw error;
    }
  }

  static async findOne(conditions = {}) {
    try {
      const { where } = conditions;
      let sql = `SELECT 
                   id, 
                   user_id as userId, 
                   signature_url as signatureUrl, 
                   file_path as filePath,
                   created_at as createdAt
                 FROM user_signatures WHERE `;
      const params = [];

      if (where.id) {
        sql += `id = ?`;
        params.push(where.id);
      } else if (where.userId) {
        sql += `user_id = ?`;
        params.push(where.userId);
      }

      sql += ` LIMIT 1`;

      const [rows] = await db.execute(sql, params);
      return rows[0] || null;
    } catch (error) {
      console.error("Error finding signature:", error);
      throw error;
    }
  }

  static async findById(id) {
    return await UserSignature.findOne({ where: { id } });
  }

  static async update(id, data) {
    try {
      const updates = [];
      const params = [];

      if (data.signatureUrl) {
        updates.push('signature_url = ?');
        params.push(data.signatureUrl);
      }
      if (data.filePath) {
        updates.push('file_path = ?');
        params.push(data.filePath);
      }

      if (updates.length === 0) {
        return false;
      }

      params.push(id);
      const sql = `UPDATE user_signatures SET ${updates.join(', ')} WHERE id = ?`;
      const [result] = await db.execute(sql, params);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error updating signature:", error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const sql = `DELETE FROM user_signatures WHERE id = ?`;
      const [result] = await db.execute(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error deleting signature:", error);
      throw error;
    }
  }

  async destroy() {
    return await UserSignature.delete(this.id);
  }
}

module.exports = UserSignature;