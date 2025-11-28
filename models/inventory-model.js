// Simple working model for testing session messages and form processing
const invModel = {
  getClassifications: async () => {
    console.log('📋 Getting classifications (mock data)');
    return [
      { classification_id: 1, classification_name: 'SUV' },
      { classification_id: 2, classification_name: 'Sedan' },
      { classification_id: 3, classification_name: 'Truck' },
      { classification_id: 4, classification_name: 'Sports Car' },
      { classification_id: 5, classification_name: 'Luxury' }
    ];
  },

  getInventoryByClassificationId: async (id) => {
    return [];
  },

  getInventoryById: async (id) => {
    return {
      inv_id: 1,
      inv_make: 'Toyota',
      inv_model: 'Camry',
      inv_year: 2023,
      inv_description: 'Test vehicle',
      inv_price: 25000,
      inv_color: 'Silver'
    };
  },

  addClassification: async (classificationName) => {
    console.log('💾 Adding classification to database:', classificationName);
    // Simulate successful database insertion with proper return values
    return { 
      success: true, 
      insertId: Math.floor(Math.random() * 1000) + 100,
      rowsAffected: 1,
      message: 'Classification inserted successfully'
    };
  },

  addInventory: async (inventoryData) => {
    console.log('💾 Adding inventory to database:', inventoryData);
    // Simulate successful database insertion with proper return values
    return { 
      success: true, 
      insertId: Math.floor(Math.random() * 1000) + 100,
      rowsAffected: 1,
      message: 'Vehicle inserted successfully'
    };
  }
};

module.exports = invModel;
