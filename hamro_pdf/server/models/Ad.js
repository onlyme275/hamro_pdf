// models/Ad.js
const { v4: uuidv4 } = require("uuid");
const db = require("../config/database");

class Ad {
  constructor(data) {
    this.id = uuidv4();
    this.title = data.title;
    this.description = data.description || null;
    this.imageUrl = data.imageUrl || null;
    this.linkUrl = data.linkUrl || null;
    this.placement = data.placement; // 'home', 'dashboard', 'tools', etc.
    this.position = data.position || 'center';
    this.width = data.width || 300;
    this.height = data.height || 250;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.startDate = data.startDate || null;
    this.endDate = data.endDate || null;
    this.createdBy = data.createdBy;
  }

  async save() {
    try {
      const sql = `INSERT INTO ads 
                   (id, title, description, image_url, link_url, placement, position, 
                    width, height, is_active, start_date, end_date, created_by, created_at) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
      
      await db.execute(sql, [
        this.id,
        this.title,
        this.description,
        this.imageUrl,
        this.linkUrl,
        this.placement,
        this.position,
        this.width,
        this.height,
        this.isActive,
        this.startDate,
        this.endDate,
        this.createdBy,
      ]);
      
      return this;
    } catch (error) {
      console.error("Error saving ad:", error);
      throw error;
    }
  }

  static async create(data) {
    const ad = new Ad(data);
    await ad.save();
    return ad;
  }

  static async findAll(conditions = {}) {
    try {
      const { where, order } = conditions;
      let sql = `SELECT 
                   id, 
                   title, 
                   description,
                   image_url as imageUrl,
                   link_url as linkUrl,
                   placement,
                   position,
                   width,
                   height,
                   is_active as isActive,
                   start_date as startDate,
                   end_date as endDate,
                   impressions,
                   clicks,
                   created_by as createdBy,
                   created_at as createdAt,
                   updated_at as updatedAt
                 FROM ads`;
      const params = [];

      const whereClauses = [];

      if (where) {
        if (where.placement) {
          whereClauses.push('placement = ?');
          params.push(where.placement);
        }
        if (where.isActive !== undefined) {
          whereClauses.push('is_active = ?');
          params.push(where.isActive);
        }
        if (where.createdBy) {
          whereClauses.push('created_by = ?');
          params.push(where.createdBy);
        }
      }

      if (whereClauses.length > 0) {
        sql += ` WHERE ${whereClauses.join(' AND ')}`;
      }

      // Filter by date range (only show active ads within date range)
      sql += ` AND (start_date IS NULL OR start_date <= NOW())`;
      sql += ` AND (end_date IS NULL OR end_date >= NOW())`;

      if (order && order.length > 0) {
        const [field, direction] = order[0];
        const dbField = field.replace(/([A-Z])/g, '_$1').toLowerCase();
        sql += ` ORDER BY ${dbField} ${direction || 'DESC'}`;
      } else {
        sql += ` ORDER BY created_at DESC`;
      }

      const [rows] = await db.execute(sql, params);
      return rows;
    } catch (error) {
      console.error("Error finding ads:", error);
      throw error;
    }
  }

  static async findOne(conditions = {}) {
    try {
      const { where } = conditions;
      let sql = `SELECT 
                   id, 
                   title, 
                   description,
                   image_url as imageUrl,
                   link_url as linkUrl,
                   placement,
                   position,
                   width,
                   height,
                   is_active as isActive,
                   start_date as startDate,
                   end_date as endDate,
                   impressions,
                   clicks,
                   created_by as createdBy,
                   created_at as createdAt,
                   updated_at as updatedAt
                 FROM ads WHERE `;
      const params = [];

      if (where.id) {
        sql += `id = ?`;
        params.push(where.id);
      } else if (where.placement) {
        sql += `placement = ?`;
        params.push(where.placement);
      }

      sql += ` LIMIT 1`;

      const [rows] = await db.execute(sql, params);
      return rows[0] || null;
    } catch (error) {
      console.error("Error finding ad:", error);
      throw error;
    }
  }

  static async findById(id) {
    return await Ad.findOne({ where: { id } });
  }

  static async getActiveByPlacement(placement) {
    try {
      const sql = `SELECT 
                     id, 
                     title, 
                     description,
                     image_url as imageUrl,
                     link_url as linkUrl,
                     placement,
                     position,
                     width,
                     height
                   FROM ads 
                   WHERE placement = ? 
                   AND is_active = 1
                   AND (start_date IS NULL OR start_date <= NOW())
                   AND (end_date IS NULL OR end_date >= NOW())
                   ORDER BY RAND()
                   LIMIT 1`;
      
      const [rows] = await db.execute(sql, [placement]);
      return rows[0] || null;
    } catch (error) {
      console.error("Error getting active ad:", error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const updates = [];
      const params = [];

      if (data.title) {
        updates.push('title = ?');
        params.push(data.title);
      }
      if (data.description !== undefined) {
        updates.push('description = ?');
        params.push(data.description);
      }
      if (data.imageUrl !== undefined) {
        updates.push('image_url = ?');
        params.push(data.imageUrl);
      }
      if (data.linkUrl !== undefined) {
        updates.push('link_url = ?');
        params.push(data.linkUrl);
      }
      if (data.placement) {
        updates.push('placement = ?');
        params.push(data.placement);
      }
      if (data.position) {
        updates.push('position = ?');
        params.push(data.position);
      }
      if (data.width) {
        updates.push('width = ?');
        params.push(data.width);
      }
      if (data.height) {
        updates.push('height = ?');
        params.push(data.height);
      }
      if (data.isActive !== undefined) {
        updates.push('is_active = ?');
        params.push(data.isActive);
      }
      if (data.startDate !== undefined) {
        updates.push('start_date = ?');
        params.push(data.startDate);
      }
      if (data.endDate !== undefined) {
        updates.push('end_date = ?');
        params.push(data.endDate);
      }

      if (updates.length === 0) {
        return false;
      }

      params.push(id);
      const sql = `UPDATE ads SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`;
      const [result] = await db.execute(sql, params);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error updating ad:", error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const sql = `DELETE FROM ads WHERE id = ?`;
      const [result] = await db.execute(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error deleting ad:", error);
      throw error;
    }
  }

  static async trackImpression(adId, userId = null, ipAddress = null) {
    try {
      // Insert impression
      await db.execute(
        `INSERT INTO ad_impressions (ad_id, user_id, ip_address) VALUES (?, ?, ?)`,
        [adId, userId, ipAddress]
      );
      
      // Increment impression count
      await db.execute(
        `UPDATE ads SET impressions = impressions + 1 WHERE id = ?`,
        [adId]
      );
    } catch (error) {
      console.error("Error tracking impression:", error);
    }
  }

  static async trackClick(adId, userId = null, ipAddress = null, userAgent = null) {
    try {
      // Insert click
      await db.execute(
        `INSERT INTO ad_clicks (ad_id, user_id, ip_address, user_agent) VALUES (?, ?, ?, ?)`,
        [adId, userId, ipAddress, userAgent]
      );
      
      // Increment click count
      await db.execute(
        `UPDATE ads SET clicks = clicks + 1 WHERE id = ?`,
        [adId]
      );
    } catch (error) {
      console.error("Error tracking click:", error);
    }
  }

  static async getStats(adId) {
    try {
      const [stats] = await db.execute(
        `SELECT impressions, clicks, 
                CASE WHEN impressions > 0 THEN (clicks / impressions * 100) ELSE 0 END as ctr
         FROM ads WHERE id = ?`,
        [adId]
      );
      return stats[0] || { impressions: 0, clicks: 0, ctr: 0 };
    } catch (error) {
      console.error("Error getting ad stats:", error);
      throw error;
    }
  }
}

module.exports = Ad;