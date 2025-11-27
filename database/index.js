const pool = require('./connection');

const db = {
  getClassifications: async () => {
    try {
      const result = await pool.query('SELECT * FROM classification ORDER BY classification_name');
      return result;
    } catch (error) {
      console.error('Database error in getClassifications:', error);
      // Fallback data
      return {
        rows: [
          { classification_id: 1, classification_name: 'SUV' },
          { classification_id: 2, classification_name: 'Sedan' },
          { classification_id: 3, classification_name: 'Truck' }
        ]
      };
    }
  },

  getInventoryByClassificationId: async (id) => {
    try {
      const result = await pool.query(
        'SELECT * FROM inventory WHERE classification_id = \ ORDER BY inv_model',
        [id]
      );
      return result.rows;
    } catch (error) {
      console.error('Database error in getInventoryByClassificationId:', error);
      return [];
    }
  },

  getInventoryById: async (id) => {
    try {
      const result = await pool.query('SELECT * FROM inventory WHERE inv_id = \', [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Database error in getInventoryById:', error);
      return null;
    }
  }
};

module.exports = db;
