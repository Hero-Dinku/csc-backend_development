// db-connection-test.js
const { Pool } = require('pg');
require('dotenv').config();

async function testConnection() {
    console.log('🔌 Testing database connection...');
    console.log('Host:', process.env.DB_HOST);
    console.log('Database:', process.env.DB_NAME);
    console.log('User:', process.env.DB_USER);
    
    const pool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: { rejectUnauthorized: false }
    });
    
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('✅ Database connected! Time:', result.rows[0].now);
        
        // Check if account table exists
        const tables = await pool.query(
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        );
        console.log('Tables found:', tables.rows.map(t => t.table_name).join(', '));
        
        // Check accounts
        const accounts = await pool.query('SELECT COUNT(*) as count FROM account');
        console.log('Total accounts:', accounts.rows[0].count);
        
        await pool.end();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
    }
}

testConnection();
