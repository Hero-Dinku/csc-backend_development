const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function setupDatabase() {
    try {
        console.log('Setting up database tables...');

        // Create account table
        await pool.query(
            CREATE TABLE IF NOT EXISTS account (
                account_id SERIAL PRIMARY KEY,
                account_firstname VARCHAR(50) NOT NULL,
                account_lastname VARCHAR(50) NOT NULL,
                account_email VARCHAR(100) NOT NULL UNIQUE,
                account_password VARCHAR(255) NOT NULL,
                account_type VARCHAR(20) NOT NULL DEFAULT 'Client',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        );
        console.log('✅ Account table created/verified');

        // Create classification table (for navigation)
        await pool.query(
            CREATE TABLE IF NOT EXISTS classification (
                classification_id SERIAL PRIMARY KEY,
                classification_name VARCHAR(100) NOT NULL UNIQUE
            )
        );
        console.log('✅ Classification table created/verified');

        // Create inventory table
        await pool.query(
            CREATE TABLE IF NOT EXISTS inventory (
                inv_id SERIAL PRIMARY KEY,
                inv_make VARCHAR(50) NOT NULL,
                inv_model VARCHAR(50) NOT NULL,
                inv_year INTEGER NOT NULL,
                inv_description TEXT,
                inv_image VARCHAR(255),
                inv_thumbnail VARCHAR(255),
                inv_price DECIMAL(10,2) NOT NULL,
                inv_miles INTEGER NOT NULL,
                inv_color VARCHAR(50) NOT NULL,
                classification_id INTEGER REFERENCES classification(classification_id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        );
        console.log('✅ Inventory table created/verified');

        // Insert sample classifications
        await pool.query(
            INSERT INTO classification (classification_name) 
            VALUES 
                ('SUV'),
                ('Sedan'),
                ('Truck'),
                ('Sports Car'),
                ('Electric Vehicle')
            ON CONFLICT (classification_name) DO NOTHING
        );
        console.log('✅ Sample classifications inserted');

        // Insert sample inventory items
        await pool.query(
            INSERT INTO inventory (
                inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id
            ) VALUES 
                ('Toyota', 'RAV4', 2023, 'Reliable SUV with great fuel economy', 28500.00, 15000, 'Silver', 1),
                ('Honda', 'Civic', 2023, 'Fuel-efficient sedan with modern features', 23500.00, 12000, 'Blue', 2),
                ('Ford', 'F-150', 2023, 'Powerful truck with towing capacity', 38500.00, 8000, 'Black', 3),
                ('Tesla', 'Model 3', 2023, 'All-electric sedan with autopilot', 42500.00, 5000, 'White', 5)
            ON CONFLICT DO NOTHING
        );
        console.log('✅ Sample inventory items inserted');

        console.log('🎉 Database setup completed successfully!');
        
    } catch (error) {
        console.error('❌ Database setup error:', error.message);
    } finally {
        await pool.end();
    }
}

setupDatabase();
