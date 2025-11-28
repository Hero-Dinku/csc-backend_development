const express = require('express');
const router = express.Router();
const invController = require('../controllers/inventoryController');
const validation = require('../utilities/validation');
const utilities = require('../utilities');

// Protected routes (require Employee or Admin)
router.get('/', utilities.checkAccountType(['Employee', 'Admin']), invController.buildManagement);
router.get('/add-classification', utilities.checkAccountType(['Employee', 'Admin']), invController.buildAddClassification);
router.post('/add-classification', utilities.checkAccountType(['Employee', 'Admin']), invController.addClassification);
router.get('/add-inventory', utilities.checkAccountType(['Employee', 'Admin']), invController.buildAddInventory);
router.post('/add-inventory', utilities.checkAccountType(['Employee', 'Admin']), invController.addInventory);

module.exports = router;
