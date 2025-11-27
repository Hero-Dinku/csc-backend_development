// Simple model for testing - we'll fix database later
const invModel = {
  getClassifications: async () => {
    // Return mock data for testing
    return [
      { classification_id: 1, classification_name: 'SUV' },
      { classification_id: 2, classification_name: 'Sedan' },
      { classification_id: 3, classification_name: 'Truck' }
    ];
  },

  getInventoryByClassificationId: async (id) => {
    return [];
  },

  getInventoryById: async (id) => {
    return {
      inv_id: 1,
      inv_make: 'Test',
      inv_model: 'Vehicle',
      inv_year: 2023,
      inv_description: 'Test vehicle',
      inv_price: 25000,
      inv_color: 'Red'
    };
  },

  addClassification: async (classificationName) => {
    console.log('Adding classification:', classificationName);
    return { success: true, insertId: 999, rowsAffected: 1 };
  },

  addInventory: async (inventoryData) => {
    console.log('Adding inventory:', inventoryData);
    return { success: true, insertId: 888, rowsAffected: 1 };
  }
};

module.exports = invModel;
