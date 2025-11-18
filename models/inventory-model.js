// Simple model with hardcoded data
const invModel = {};

// Get vehicles by classification_id
invModel.getVehiclesByClassificationId = async function(classification_id) {
    // This function is no longer needed since we handle data in utilities
    return [];
};

// Get vehicle detail by inventory_id
invModel.getVehicleById = async function(inv_id) {
    // This function is no longer needed since we handle data in utilities
    return null;
};

module.exports = invModel;
