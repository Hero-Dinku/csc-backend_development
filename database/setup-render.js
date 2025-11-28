const { Pool } = require("pg");
require("dotenv").config();

async function setupRenderDatabase() {
    console.log("🚀 Setting up Render PostgreSQL database...");
    
    const pool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: { rejectUnauthorized: false }
    });
    
    try {
        // Create accounts table
        console.log("📊 Creating accounts table...");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS account (
                account_id SERIAL PRIMARY KEY,
                account_firstname VARCHAR(50) NOT NULL,
                account_lastname VARCHAR(50) NOT NULL,
                account_email VARCHAR(100) NOT NULL UNIQUE,
                account_password VARCHAR(255) NOT NULL,
                account_type VARCHAR(20) NOT NULL DEFAULT 'Client',
                account_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("✅ Accounts table created/verified");
        
        // Create classification table
        console.log("📊 Creating classification table...");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS classification (
                classification_id SERIAL PRIMARY KEY,
                classification_name VARCHAR(30) NOT NULL UNIQUE
            )
        `);
        console.log("✅ Classification table created/verified");
        
        // Create inventory table
        console.log("📊 Creating inventory table...");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS inventory (
                inv_id SERIAL PRIMARY KEY,
                inv_make VARCHAR(50) NOT NULL,
                inv_model VARCHAR(50) NOT NULL,
                inv_year INTEGER NOT NULL,
                inv_description TEXT,
                inv_image VARCHAR(255),
                inv_thumbnail VARCHAR(255),
                inv_price DECIMAL(10,2) NOT NULL,
                inv_miles INTEGER,
                inv_color VARCHAR(30),
                classification_id INTEGER REFERENCES classification(classification_id) ON DELETE CASCADE
            )
        `);
        console.log("✅ Inventory table created/verified");
        
        // Insert sample classifications
        console.log("📥 Inserting sample classifications...");
        await pool.query(`
            INSERT INTO classification (classification_name) VALUES 
            ('SUV'), ('Sedan'), ('Truck'), ('Sports Car'), ('Electric')
            ON CONFLICT (classification_name) DO NOTHING
        `);
        console.log("✅ Sample classifications inserted");
        
        // Show table info
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log("📋 Available tables:", tables.rows.map(row => row.table_name).join(", "));
        
        console.log("🎉 Render database setup completed successfully!");
        
    } catch (error) {
        console.error("❌ Database setup failed:", error.message);
    } finally {
        await pool.end();
    }
}

setupRenderDatabase();
