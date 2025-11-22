// Simple database fallback
const fallbackData = {
  getClassifications: () => ({
    rows: [
      { classification_id: 1, classification_name: 'Custom' },
      { classification_id: 2, classification_name: 'Sedan' },
      { classification_id: 3, classification_name: 'SUV' },
      { classification_id: 4, classification_name: 'Truck' },
      { classification_id: 5, classification_name: 'Sports Car' }
    ]
  }),
  
  getInventoryByClassificationId: (id) => [
    {
      inv_id: 1,
      inv_make: 'Toyota',
      inv_model: 'Camry', 
      inv_year: 2023,
      inv_description: 'Reliable sedan',
      inv_image: '/images/vehicles/no-image.png',
      inv_thumbnail: '/images/vehicles/no-image-tn.png',
      inv_price: 25000,
      inv_miles: 0,
      inv_color: 'Silver',
      classification_id: id
    }
  ],
  
  getInventoryById: (id) => [
    {
      inv_id: id,
      inv_make: 'Toyota',
      inv_model: 'Camry',
      inv_year: 2023,
      inv_description: 'Reliable family sedan',
      inv_image: '/images/vehicles/no-image.png', 
      inv_thumbnail: '/images/vehicles/no-image-tn.png',
      inv_price: 25000,
      inv_miles: 0,
      inv_color: 'Silver',
      classification_id: 2
    }
  ]
};

module.exports = fallbackData;
