const express = require('express');
const router = express.Router();
const invController = require('../controllers/inventoryController');
const validation = require('../utilities/validation');

// Management view
router.get('/', invController.buildManagement);

// Add classification - GET
router.get('/add-classification', invController.buildAddClassification);

// Add classification - POST with validation
router.post('/add-classification', 
    (req, res, next) => {
        const errors = validation.checkClassificationName(req.body.classification_name);
        if (errors.length > 0) {
            req.flash('error', errors.join(', '));
            return res.redirect('/inv/add-classification');
        }
        next();
    },
    invController.addClassification
);

// Add inventory - GET
router.get('/add-inventory', invController.buildAddInventory);

// Add inventory - POST with validation
router.post('/add-inventory',
    (req, res, next) => {
        const errors = validation.checkInventoryData(req.body);
        if (errors.length > 0) {
            req.flash('error', errors.join(', '));
            req.flash('formData', req.body);
            return res.redirect('/inv/add-inventory');
        }
        next();
    },
    invController.addInventory
);

// Remove the problematic routes that don't have controller functions
// router.get('/type/:classificationId', invController.buildByClassificationId);
// router.get('/detail/:inventoryId', invController.buildByInventoryId);

module.exports = router;
