const { Pool } = require('pg');
require('dotenv').config();

async function addColumn() {
    const pool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('Adding profile picture column...');
        await pool.query(`
            ALTER TABLE account 
            ADD COLUMN IF NOT EXISTS profile_picture_url VARCHAR(255) DEFAULT NULL
        `);
        console.log('✅ Column added successfully!');
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        pool.end();
    }
}

addColumn();
