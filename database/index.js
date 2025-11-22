const mysql = require('mysql2');
require('dotenv').config();

// Fallback data for when database is not available
const fallbackData = {
  classifications: [
    { classification_id: 1, classification_name: 'Custom' },
    { classification_id: 2, classification_name: 'Sedan' },
    { classification_id: 3, classification_name: 'SUV' },
    { classification_id: 4, classification_name: 'Truck' },
    { classification_id: 5, classification_name: 'Sports Car' }
  ],
  inventory: [
    {
      inv_id: 1,
      inv_make: 'Toyota',
      inv_model: 'Camry',
      inv_year: 2023,
      inv_description: 'Reliable family sedan with great fuel economy',
      inv_image: '/images/vehicles/no-image.png',
      inv_thumbnail: '/images/vehicles/no-image-tn.png',
      inv_price: 25000.00,
      inv_miles: 0,
      inv_color: 'Silver',
      classification_id: 2
    },
    {
      inv_id: 2,
      inv_make: 'Honda',
      inv_model: 'CR-V',
      inv_year: 2023,
      inv_description: 'Spacious SUV perfect for families',
      inv_image: '/images/vehicles/no-image.png',
      inv_thumbnail: '/images/vehicles/no-image-tn.png',
      inv_price: 32000.00,
      inv_miles: 0,
      inv_color: 'Blue',
      classification_id: 3
    }
  ]
};

let pool;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'cse340',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  
  console.log('MySQL pool created successfully');
} catch (error) {
  console.log('MySQL pool creation failed, using fallback data:', error.message);
  pool = null;
}

const promisePool = pool ? pool.promise() : null;

// Custom query function that falls back to local data
const query = async (sql, params = []) => {
  if (promisePool) {
    try {
      const [rows] = await promisePool.query(sql, params);
      return { rows };
    } catch (error) {
      console.log('Database query failed, using fallback data:', error.message);
      return await fallbackQuery(sql, params);
    }
  } else {
    return await fallbackQuery(sql, params);
  }
};

// Fallback query function that uses local data
const fallbackQuery = async (sql, params) => {
  console.log('Using fallback data for query:', sql);
  
  // Simple SQL parsing for fallback data
  if (sql.includes('classification') && sql.includes('SELECT')) {
    return { rows: fallbackData.classifications };
  }
  
  if (sql.includes('inventory') && sql.includes('SELECT')) {
    if (sql.includes('WHERE')) {
      if (sql.includes('classification_id')) {
        const classId = params[0];
        const filtered = fallbackData.inventory.filter(item => item.classification_id == classId);
        return { rows: filtered };
      }
      if (sql.includes('inv_id')) {
        const invId = params[0];
        const filtered = fallbackData.inventory.filter(item => item.inv_id == invId);
        return { rows: filtered };
      }
    }
    return { rows: fallbackData.inventory };
  }
  
  if (sql.includes('INSERT')) {
    console.log('INSERT operations not supported in fallback mode');
    return { insertId: 0 };
  }
  
  return { rows: [] };
};

module.exports = { query };
