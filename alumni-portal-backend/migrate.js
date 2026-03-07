/* eslint-disable no-undef */

const migrate = require('node-pg-migrate');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    databaseUrl: process.env.DATABASE_URL,
  });

const runMigrations = async () => {
  await migrate({
    databaseUrl: process.env.DATABASE_URL,
    dir: 'migrations',
    direction: 'up',
  });
 
};

runMigrations()
  .then(() => {
    pool.end();
  })
  .catch(() => {
    pool.end();
  });
