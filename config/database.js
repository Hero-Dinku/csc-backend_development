const { Pool } = require('pg');
require('dotenv').config();

console.log('🔄 Database configuration loaded:');
console.log('- Host:', process.env.DB_HOST);
console.log('- Database:', process.env.DB_NAME);
console.log('- User:', process.env.DB_USER);

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true' ? { 
        rejectUnauthorized: false 
    } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
});

// Test connection on startup
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        console.error('Check your .env file and database credentials');
    } else {
        console.log('✅ Database connected successfully');
        console.log('⏰ Server time:', res.rows[0].now);
    }
});

module.exports = pool;
