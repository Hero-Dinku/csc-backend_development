const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Database connection events
pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ PostgreSQL database connection error:', err);
});

// Utility functions with comprehensive error handling
const utilities = {
    query: async (text, params) => {
        try {
            const result = await pool.query(text, params);
            return result;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    },
    
    // Get navigation data
    async getNav() {
        try {
            const data = await pool.query(
                'SELECT classification_id, classification_name FROM classification ORDER BY classification_name'
            );
            return data.rows;
        } catch (error) {
            console.error('getNav error:', error);
            return [];
        }
    },
    
    // Build classification view
    async buildClassificationGrid(classification_id) {
        try {
            const data = await pool.query(
                'SELECT i.*, c.classification_name FROM inventory AS i JOIN classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = ',
                [classification_id]
            );
            return data.rows;
        } catch (error) {
            console.error('buildClassificationGrid error:', error);
            return [];
        }
    },

    // Get all inventory items
    async getAllInventory() {
        try {
            const data = await pool.query(
                'SELECT i.*, c.classification_name FROM inventory AS i JOIN classification AS c ON i.classification_id = c.classification_id ORDER BY i.inv_make, i.inv_model'
            );
            return data.rows;
        } catch (error) {
            console.error('getAllInventory error:', error);
            return [];
        }
    },

    // Check if database is healthy
    async checkHealth() {
        try {
            await pool.query('SELECT 1');
            return true;
        } catch (error) {
            console.error('Database health check failed:', error);
            return false;
        }
    }
};

module.exports = utilities;
