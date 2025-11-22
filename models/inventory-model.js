const db = require('../database/');

const invModel = {};

/* ***************************
 *  Get all classifications
 * ************************** */
invModel.getClassifications = async function() {
  try {
    return await db.query("SELECT * FROM classification ORDER BY classification_name");
  } catch (error) {
    console.error('Error in getClassifications:', error);
    return { rows: [] };
  }
};

/* ***************************
 *  Get inventory by classification ID
 * ************************** */
invModel.getInventoryByClassificationId = async function(classification_id) {
  try {
    const result = await db.query(
      `SELECT * FROM inventory AS i 
      JOIN classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = ?`,
      [classification_id]
    );
    return result.rows;
  } catch (error) {
    console.error('Error in getInventoryByClassificationId:', error);
    return [];
  }
};

/* ***************************
 *  Get inventory by ID
 * ************************** */
invModel.getInventoryById = async function(inv_id) {
  try {
    const result = await db.query(
      `SELECT * FROM inventory WHERE inv_id = ?`,
      [inv_id]
    );
    return result.rows;
  } catch (error) {
    console.error('Error in getInventoryById:', error);
    return [];
  }
};

/* ***************************
 *  Add New Classification
 * ************************** */
invModel.addClassification = async function(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES (?)";
    const result = await db.query(sql, [classification_name]);
    return result;
  } catch (error) {
    console.error('Error in addClassification:', error);
    throw error;
  }
};

/* ***************************
 *  Add New Inventory Item
 * ************************** */
invModel.addInventory = async function(inventoryData) {
  try {
    const sql = `INSERT INTO inventory (
      classification_id, inv_make, inv_model, inv_year, 
      inv_description, inv_image, inv_thumbnail, 
      inv_price, inv_miles, inv_color
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const result = await db.query(sql, [
      inventoryData.classification_id,
      inventoryData.inv_make,
      inventoryData.inv_model,
      inventoryData.inv_year,
      inventoryData.inv_description,
      inventoryData.inv_image,
      inventoryData.inv_thumbnail,
      inventoryData.inv_price,
      inventoryData.inv_miles,
      inventoryData.inv_color
    ]);
    return result;
  } catch (error) {
    console.error('Error in addInventory:', error);
    throw error;
  }
};

module.exports = invModel;
