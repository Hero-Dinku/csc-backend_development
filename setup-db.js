const { Pool } = require("pg")
require("dotenv").config()
const fs = require("fs")

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
    console.log("Connecting to database...")
    
    const sql = fs.readFileSync("database/setup.sql", "utf8")
    
    console.log("Running setup SQL...")
    await pool.query(sql)
    
    console.log("✓ Database setup complete!")
    console.log("✓ Sample data inserted!")
    console.log("\nYou can now run: node server.js")
    
    pool.end()
  } catch (error) {
    console.error("Error setting up database:", error)
    pool.end()
  }
}

setupDatabase()
