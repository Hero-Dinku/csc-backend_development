const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false
});

const query = async (text, params) => {
    console.log("SQL:", text);
    console.log("Params:", params);
    const result = await pool.query(text, params);
    return result;
};

const getNav = async () => {
    const result = await query("SELECT * FROM classification ORDER BY classification_name", []);
    return result.rows;
};

module.exports = { query, getNav };