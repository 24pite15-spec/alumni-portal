const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = {
  /**
   * Get all posts with user details
   */
  getAllPosts: async () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          hfp.post_id,
          hfp.user_id,
          hfp.post_image_path,
		  hfp.image_link AS image_url,
          au.profile_photo as profile_photo
        FROM home_feed_posts hfp
        LEFT JOIN alumni_users au ON hfp.user_id = au.user_id
        ORDER BY hfp.created_at DESC
      `;

      db.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results || []);
        }
      });
    });
  },

  /**
   * Get posts by specific user
   */
  getPostsByUser: async (userId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          hfp.post_id,
          hfp.user_id,
          hfp.post_image_path,
		  hfp.image_link AS image_url,
          au.profile_photo as profile_photo
        FROM home_feed_posts hfp
        LEFT JOIN alumni_users au ON hfp.user_id = au.user_id
        WHERE hfp.user_id = ?
        ORDER BY hfp.created_at DESC
      `;

      db.query(sql, [userId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results || []);
        }
      });
    });
  },

  /**
   * Create new post
   */
  createPost: async (postData) => {
    return new Promise((resolve, reject) => {
      const {
        userId,
        postDescription,
        postImagePath,
        imageLink,
      } = postData;

      if (!userId) {
        reject(new Error('User ID is required'));
        return;
      }

      const sql = `
        INSERT INTO home_feed_posts 
        (user_id, post_description, post_image_path, image_link, created_at)
        VALUES (?, ?, ?, ?, NOW())
      `;

      const values = [
        userId,
        postDescription || null,
        postImagePath || null,
        imageLink || null,
      ];

      db.query(sql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            post_id: result.insertId,
            user_id: userId,
            post_description: postDescription,
            post_image_path: postImagePath,
            image_link: imageLink,
            created_at: new Date(),
          });
        }
      });
    });
  },

  /**
   * Delete post
   */
  deletePost: async (postId, userId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        DELETE FROM home_feed_posts 
        WHERE post_id = ? AND user_id = ?
      `;

      db.query(sql, [postId, userId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          if (result.affectedRows === 0) {
            reject(new Error('Post not found or unauthorized'));
          } else {
            resolve({ message: 'Post deleted successfully' });
          }
        }
      });
    });
  },

  /**
   * Update post
   */
  updatePost: async (postData) => {
    return new Promise((resolve, reject) => {
      const {
        postId,
        userId,
        postDescription,
        postImagePath,
        imageLink,
      } = postData;

      const updates = [];
      const values = [];

      if (postDescription !== undefined) {
        updates.push('post_description = ?');
        values.push(postDescription);
      }

      if (postImagePath !== undefined) {
        updates.push('post_image_path = ?');
        values.push(postImagePath);
      }

      if (imageLink !== undefined) {
        updates.push('image_link = ?');
        values.push(imageLink);
      }

      if (updates.length === 0) {
        reject(new Error('No fields to update'));
        return;
      }

      values.push(postId);
      values.push(userId);

      const sql = `
        UPDATE home_feed_posts
        SET ${updates.join(', ')}
        WHERE post_id = ? AND user_id = ?
      `;

      db.query(sql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          if (result.affectedRows === 0) {
            reject(new Error('Post not found or unauthorized'));
          } else {
            resolve({ message: 'Post updated successfully' });
          }
        }
      });
    });
  },
};
