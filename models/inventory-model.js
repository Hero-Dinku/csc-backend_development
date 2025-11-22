const db = require('../database/');

const invModel = {
  getClassifications: async () => db.getClassifications(),
  getInventoryByClassificationId: async (id) => db.getInventoryByClassificationId(id),
  getInventoryById: async (id) => db.getInventoryById(id),
  addClassification: async (name) => ({ insertId: 1 }),
  addInventory: async (data) => ({ insertId: 1 })
};

module.exports = invModel;
