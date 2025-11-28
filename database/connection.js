const { Pool } = require('pg');
require('dotenv').config();

// Database configuration for Render PostgreSQL
const config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
};

console.log('🔗 Connecting to Render PostgreSQL...');
console.log('📡 Host:', process.env.DB_HOST);
console.log('💾 Database:', process.env.DB_NAME);
console.log('👤 User:', process.env.DB_USER);

const pool = new Pool(config);

// Test database connection
pool.on('connect', () => {
    console.log('✅ Connected to Render PostgreSQL database successfully!');
});

pool.on('error', (err) => {
    console.error('❌ Database connection error:', err.message);
});

// Enhanced connection test
const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Database connection test successful');
        
        // Test basic query
        const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
        console.log('✅ PostgreSQL Version:', result.rows[0].pg_version.split(',')[0]);
        console.log('✅ Database time:', result.rows[0].current_time);
        
        client.release();
        return true;
    } catch (error) {
        console.error('❌ Database test query failed:', error.message);
        return false;
    }
};

// Test connection on startup
testConnection();

module.exports = pool;
