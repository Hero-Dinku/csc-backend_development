const invModel = require('../models/inventory-model');

const invController = {};

// Build management view
invController.buildManagement = async (req, res, next) => {
    try {
        res.render('inventory/management', {
            title: 'Inventory Management',
            messages: res.locals.messages
        });
    } catch (error) {
        next(error);
    }
};

// Build add classification view
invController.buildAddClassification = async (req, res, next) => {
    try {
        res.render('inventory/add-classification', {
            title: 'Add Classification',
            messages: res.locals.messages,
            classification_name: req.flash('formData')?.[0]?.classification_name || ''
        });
    } catch (error) {
        next(error);
    }
};

// Add new classification
invController.addClassification = async (req, res, next) => {
    try {
        const { classification_name } = req.body;
        
        const result = await invModel.addClassification(classification_name);
        
        if (result.success) {
            req.flash('success', 'Classification added successfully!');
            res.redirect('/inv');
        } else {
            req.flash('error', 'Failed to add classification: ' + result.error);
            res.redirect('/inv/add-classification');
        }
    } catch (error) {
        req.flash('error', 'Error adding classification: ' + error.message);
        res.redirect('/inv/add-classification');
    }
};

// Build add inventory view
invController.buildAddInventory = async (req, res, next) => {
    try {
        const classifications = await invModel.getClassifications();
        
        const formData = req.flash('formData')[0] || {};
        
        res.render('inventory/add-inventory', {
            title: 'Add Vehicle',
            messages: res.locals.messages,
            classifications,
            formData
        });
    } catch (error) {
        next(error);
    }
};

// Add new inventory
invController.addInventory = async (req, res, next) => {
    try {
        const inventoryData = req.body;
        
        const result = await invModel.addInventory(inventoryData);
        
        if (result.success) {
            req.flash('success', 'Vehicle added successfully!');
            res.redirect('/inv');
        } else {
            req.flash('error', 'Failed to add vehicle: ' + result.error);
            req.flash('formData', inventoryData);
            res.redirect('/inv/add-inventory');
        }
    } catch (error) {
        req.flash('error', 'Error adding vehicle: ' + error.message);
        req.flash('formData', req.body);
        res.redirect('/inv/add-inventory');
    }
};

// Build inventory by classification view
invController.buildByClassificationId = async (req, res, next) => {
    try {
        const classification_id = req.params.classificationId;
        const data = await invModel.getInventoryByClassificationId(classification_id);
        
        const title = data.length > 0 ? data[0].classification_name : 'Vehicles';
        
        res.render('inventory/classification', {
            title: title,
            vehicles: data,
            messages: res.locals.messages
        });
    } catch (error) {
        next(error);
    }
};

// Build vehicle detail view
invController.buildByInventoryId = async (req, res, next) => {
    try {
        const inventory_id = req.params.inventoryId;
        const data = await invModel.getInventoryById(inventory_id);
        
        res.render('inventory/detail', {
            title: data.inv_make + ' ' + data.inv_model,
            vehicle: data,
            messages: res.locals.messages
        });
    } catch (error) {
        next(error);
    }
};

module.exports = invController;
