const mysql = require('mysql2');

// note: reuse the same pool configuration as in server.js
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
   * Retrieve alumni list optionally filtered by query parameters
   * filters: year, role, location, name
   */
  getAll: async (filters = {}) => {
    return new Promise((resolve, reject) => {
      let baseSql = `
        SELECT 
          user_id,
          full_name,
          year_of_passout as year,
          company_name,
          job_role,
          work_location,
          profile_photo
        FROM alumni_users
        /* note: we only want alumni whose account has been approved.  The
           personal "status" (working/studying/etc) will live in a separate
           column once the migration runs, so this condition continues to
           check the approval field. */
        WHERE status = 'APPROVED'
      `;
      const values = [];

      if (filters.year) {
        baseSql += ' AND year_of_passout = ?';
        values.push(filters.year);
      }
      if (filters.role) {
        baseSql += ' AND job_role LIKE ?';
        values.push(`%${filters.role}%`);
      }
      if (filters.location) {
        baseSql += ' AND work_location LIKE ?';
        values.push(`%${filters.location}%`);
      }
      if (filters.name) {
        baseSql += ' AND full_name LIKE ?';
        values.push(`%${filters.name}%`);
      }

      baseSql += ' ORDER BY year_of_passout DESC, full_name ASC';

      db.query(baseSql, values, (err, results) => {
        if (err) return reject(err);
        resolve(results || []);
      });
    });
  },

  /**
   * Get single alumni by user_id
   */
  getById: async (userId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT *, year_of_passout AS batchYear
        FROM alumni_users
        WHERE user_id = ?
      `;
      db.query(sql, [userId], (err, results) => {
        if (err) return reject(err);
        if (!results.length) return resolve(null);
        const row = results[0];
        // add convenience alias in case frontend expects `year` as well
        row.year = row.year_of_passout;
        resolve(row);
      });
    });
  },
};
