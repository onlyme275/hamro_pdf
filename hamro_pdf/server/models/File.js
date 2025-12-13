// models/File.js
const { v4: uuidv4 } = require("uuid");
const db = require("../config/database");

class File {
  constructor(userId, fileName, fileSize, filePath, mimeType = "application/pdf") {
    this.id = uuidv4();
    this.userId = userId;
    this.fileName = fileName;
    this.fileSize = fileSize;
    this.filePath = filePath;
    this.mimeType = mimeType;
  }

  async save() {
    try {
      const sql = `INSERT INTO files (id, user_id, file_name, file_size, file_path, mime_type, uploaded_at) 
                   VALUES (?, ?, ?, ?, ?, ?, NOW())`;
      const [result] = await db.execute(sql, [
        this.id,
        this.userId,
        this.fileName,
        this.fileSize,
        this.filePath,
        this.mimeType,
      ]);
      return this;
    } catch (error) {
      console.error("Error saving file:", error);
      throw error;
    }
  }

  static async create(data) {
    const file = new File(
      data.userId,
      data.fileName,
      data.fileSize,
      data.filePath,
      data.mimeType
    );
    await file.save();
    return file;
  }

  static async findAll(conditions = {}) {
    try {
      const { where, order } = conditions;
      let sql = `SELECT 
                   id, 
                   user_id as userId, 
                   file_name as fileName, 
                   file_size as fileSize, 
                   file_path as filePath, 
                   mime_type as mimeType,
                   uploaded_at as uploadedAt
                 FROM files`;
      const params = [];

      if (where && where.userId) {
        sql += ` WHERE user_id = ?`;
        params.push(where.userId);
      }

      // Handle custom ordering or default
      if (order && order.length > 0) {
        const [field, direction] = order[0];
        const dbField = field === 'uploadedAt' ? 'uploaded_at' : field;
        sql += ` ORDER BY ${dbField} ${direction || 'DESC'}`;
      } else {
        sql += ` ORDER BY uploaded_at DESC`;
      }

      const [rows] = await db.execute(sql, params);
      return rows;
    } catch (error) {
      console.error("Error finding files:", error);
      throw error;
    }
  }

  static async findOne(conditions = {}) {
    try {
      const { where } = conditions;
      let sql = `SELECT 
                   id, 
                   user_id as userId, 
                   file_name as fileName, 
                   file_size as fileSize, 
                   file_path as filePath, 
                   mime_type as mimeType,
                   uploaded_at as uploadedAt
                 FROM files WHERE `;
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
      console.error("Error finding file:", error);
      throw error;
    }
  }

  static async findById(id) {
    return await File.findOne({ where: { id } });
  }

  static async update(id, data) {
    try {
      const updates = [];
      const params = [];

      if (data.fileName) {
        updates.push('file_name = ?');
        params.push(data.fileName);
      }
      if (data.fileSize) {
        updates.push('file_size = ?');
        params.push(data.fileSize);
      }
      if (data.filePath) {
        updates.push('file_path = ?');
        params.push(data.filePath);
      }
      if (data.mimeType) {
        updates.push('mime_type = ?');
        params.push(data.mimeType);
      }

      if (updates.length === 0) {
        return false;
      }

      params.push(id);
      const sql = `UPDATE files SET ${updates.join(', ')} WHERE id = ?`;
      const [result] = await db.execute(sql, params);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error updating file:", error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const sql = `DELETE FROM files WHERE id = ?`;
      const [result] = await db.execute(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }

  async destroy() {
    return await File.delete(this.id);
  }
}

module.exports = File;