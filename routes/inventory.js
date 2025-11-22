const express = require('express');
const router = express.Router();
const invController = require('../controllers/inventoryController');

// Validation middleware functions
const validateClassification = (req, res, next) => {
  const { classification_name } = req.body;
  
  if (!classification_name || classification_name.trim() === '') {
    req.flash('error', 'Classification name is required.');
    return res.redirect('/inv/add-classification');
  }
  
  const classificationPattern = /^[A-Za-z0-9]{1,30}$/;
  if (!classificationPattern.test(classification_name)) {
    req.flash('error', 'Classification name must be 1-30 characters with no spaces or special characters.');
    return res.redirect('/inv/add-classification');
  }
  
  next();
};

const validateInventory = (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color
  } = req.body;
  
  const errors = [];
  
  if (!classification_id) errors.push('Classification is required.');
  if (!inv_make || inv_make.trim() === '') errors.push('Make is required.');
  if (!inv_model || inv_model.trim() === '') errors.push('Model is required.');
  if (!inv_year || inv_year < 1900 || inv_year > 2030) errors.push('Valid year between 1900-2030 is required.');
  if (!inv_description || inv_description.trim() === '') errors.push('Description is required.');
  if (!inv_price || inv_price < 0) errors.push('Valid price is required.');
  if (!inv_miles || inv_miles < 0) errors.push('Valid miles is required.');
  if (!inv_color || inv_color.trim() === '') errors.push('Color is required.');
  
  if (errors.length > 0) {
    req.flash('error', errors.join(' '));
    return res.redirect('/inv/add-inventory');
  }
  
  next();
};

// Use the correct function names based on what's available
// Route to management view
router.get('/', invController.buildManagement || invController.buildManagementView);

// New routes for assignment 4
router.get('/add-classification', invController.buildAddClassification);
router.post('/add-classification', validateClassification, invController.addClassification);
router.get('/add-inventory', invController.buildAddInventory);
router.post('/add-inventory', validateInventory, invController.addInventory);

// Existing routes - use whatever functions exist
router.get('/type/:classificationId', invController.buildByClassificationId);
router.get('/detail/:invId', invController.buildByInventoryId);

module.exports = router;

// Catch-all for invalid inventory routes
router.get('*', (req, res) => {
  res.status(404).render('errors/error', {
    title: 'Page Not Found',
    message: 'The requested inventory page was not found.',
    nav: await utilities.getNav(),
    errors: null
  });
});
