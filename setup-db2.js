const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
})

async function setupDatabase() {
  try {
    console.log('Creating classification table...')
    await pool.query(
      CREATE TABLE IF NOT EXISTS public.classification (
        classification_id SERIAL PRIMARY KEY,
        classification_name VARCHAR(255) NOT NULL UNIQUE
      )
    )
    
    console.log('Creating inventory table...')
    await pool.query(
      CREATE TABLE IF NOT EXISTS public.inventory (
        inv_id SERIAL PRIMARY KEY,
        inv_make VARCHAR(50) NOT NULL,
        inv_model VARCHAR(50) NOT NULL,
        inv_year INTEGER NOT NULL CHECK (inv_year >= 1900),
        inv_description TEXT NOT NULL,
        inv_image VARCHAR(255) NOT NULL,
        inv_thumbnail VARCHAR(255) NOT NULL,
        inv_price DECIMAL(10, 2) NOT NULL CHECK (inv_price >= 0),
        inv_miles INTEGER NOT NULL CHECK (inv_miles >= 0),
        inv_color VARCHAR(50) NOT NULL,
        classification_id INTEGER NOT NULL,
        FOREIGN KEY (classification_id) REFERENCES public.classification (classification_id)
      )
    )
    
    console.log('Creating account table...')
    await pool.query(
      CREATE TABLE IF NOT EXISTS public.account (
        account_id SERIAL PRIMARY KEY,
        account_firstname VARCHAR(50) NOT NULL,
        account_lastname VARCHAR(50) NOT NULL,
        account_email VARCHAR(100) NOT NULL UNIQUE,
        account_password VARCHAR(255) NOT NULL,
        account_type VARCHAR(20) DEFAULT 'Client' CHECK (account_type IN ('Client', 'Employee', 'Admin'))
      )
    )
    
    console.log('Inserting classifications...')
    await pool.query(
      INSERT INTO public.classification (classification_name)
      VALUES ('Custom'), ('Sport'), ('SUV'), ('Truck'), ('Sedan')
      ON CONFLICT (classification_name) DO NOTHING
    )
    
    console.log('Inserting sample vehicles...')
    await pool.query(
      INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
      VALUES 
        ('DMC', 'Delorean', 1981, 'The DMC DeLorean is a sports car.', '/images/vehicles/delorean.jpg', '/images/vehicles/delorean-tn.jpg', 40000.00, 50000, 'Silver', 1),
        ('Jeep', 'Wrangler', 2020, 'The Jeep Wrangler is an SUV.', '/images/vehicles/wrangler.jpg', '/images/vehicles/wrangler-tn.jpg', 35000.00, 25000, 'Red', 3)
      ON CONFLICT DO NOTHING
    )
    
    console.log('Inserting admin account...')
    await pool.query(
      INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES ('Admin', 'User', 'admin@csemotors.com', '\\\.YhKQh0YLl3gJxPzXGq3pqZlGZqHpWqK', 'Admin')
      ON CONFLICT (account_email) DO NOTHING
    )
    
    console.log('Database setup complete!')
    console.log('Admin login: admin@csemotors.com / Admin123!')
    
    pool.end()
  } catch (error) {
    console.error('Error:', error.message)
    pool.end()
  }
}

setupDatabase()
