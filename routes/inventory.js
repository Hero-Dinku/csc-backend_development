const express = require('express');
const router = express.Router();

// Management view
router.get('/', (req, res) => {
    res.render('inventory/management', {
        title: 'Inventory Management',
        message: null
    });
});

// Add classification
router.get('/add-classification', (req, res) => {
    res.render('inventory/add-classification', {
        title: 'Add Classification',
        message: null
    });
});

router.post('/add-classification', (req, res) => {
    const { classification_name } = req.body;
    // Simulate success
    res.redirect('/inv?message=Classification added successfully');
});

// Add inventory
router.get('/add-inventory', (req, res) => {
    res.render('inventory/add-inventory', {
        title: 'Add Vehicle',
        message: null,
        formData: {}
    });
});

router.post('/add-inventory', (req, res) => {
    // Simulate success
    res.redirect('/inv?message=Vehicle added successfully');
});

// Classification view
router.get('/type/:id', (req, res) => {
    res.render('inventory/classification', {
        title: 'Vehicles',
        classificationId: req.params.id
    });
});

// Vehicle detail
router.get('/detail/:id', (req, res) => {
    res.render('inventory/detail', {
        title: 'Vehicle Details',
        vehicleId: req.params.id
    });
});

module.exports = router;
