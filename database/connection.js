const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/cse_motors',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test connection
pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Database connection error:', err);
});

module.exports = pool;
