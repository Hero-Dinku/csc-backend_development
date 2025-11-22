const pool = require('../utilities/database-connection');

const invModel = {};

// Get all classifications
invModel.getClassifications = async function() {
    try {
        const sql = "SELECT * FROM classification ORDER BY classification_name";
        const [rows] = await pool.execute(sql);
        return rows;
    } catch (error) {
        console.error('Error getting classifications:', error);
        return [];
    }
};

// Get vehicles by classification_id
invModel.getVehiclesByClassificationId = async function(classification_id) {
    try {
        const sql = "SELECT * FROM inventory WHERE classification_id = ? ORDER BY inv_year DESC";
        const [rows] = await pool.execute(sql, [classification_id]);
        return rows;
    } catch (error) {
        console.error('Error getting vehicles by classification:', error);
        return [];
    }
};

// Get vehicle detail by inventory_id
invModel.getVehicleById = async function(inv_id) {
    try {
        const sql = "SELECT * FROM inventory WHERE inv_id = ?";
        const [rows] = await pool.execute(sql, [inv_id]);
        return rows && rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error getting vehicle by ID:', error);
        return null;
    }
};

// Add new classification
invModel.addClassification = async function(classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES (?)";
        const [result] = await pool.execute(sql, [classification_name]);
        return result;
    } catch (error) {
        console.error('Error adding classification:', error);
        throw error;
    }
};

// Add new vehicle
invModel.addVehicle = async function(vehicleData) {
    try {
        const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        const [result] = await pool.execute(sql, [
            vehicleData.inv_make,
            vehicleData.inv_model,
            vehicleData.inv_year,
            vehicleData.inv_description,
            vehicleData.inv_image,
            vehicleData.inv_thumbnail,
            vehicleData.inv_price,
            vehicleData.inv_miles,
            vehicleData.inv_color,
            vehicleData.classification_id
        ]);
        
        return result;
    } catch (error) {
        console.error('Error adding vehicle:', error);
        throw error;
    }
};

module.exports = invModel;
