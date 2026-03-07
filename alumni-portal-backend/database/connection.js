
const { Pool } = require('pg');
const pool = new Pool({
  // eslint-disable-next-line no-undef
  connectionString: process.env.DATABASE_URL
});

module.exports = pool;