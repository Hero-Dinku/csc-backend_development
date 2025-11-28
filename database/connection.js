const { Pool } = require('pg');
require('dotenv').config();

// Database configuration - using environment variables for security
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'cse_motors',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
    // For Render deployment
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test connection
pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ Database connection error:', err);
});

// Test the connection on startup
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Database test query failed:', err);
    } else {
        console.log('✅ Database test query successful:', res.rows[0]);
    }
});

module.exports = pool;
