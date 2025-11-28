const invModel = require('../models/inventory-model');

const invController = {};

// Build management view
invController.buildManagement = async (req, res, next) => {
    try {
        console.log('🏢 Building management view');
        console.log('Flash messages in management:', res.locals.messages);
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
        console.log('📝 Building add classification view');
        console.log('Flash messages in add classification:', res.locals.messages);
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
        console.log('➕ Adding classification:', classification_name);
        
        // Validate input
        if (!classification_name || classification_name.trim() === '') {
            req.flash('error', 'Classification name is required');
            return res.redirect('/inv/add-classification');
        }
        
        if (classification_name.length < 2 || classification_name.length > 30) {
            req.flash('error', 'Classification name must be between 2 and 30 characters');
            return res.redirect('/inv/add-classification');
        }
        
        const result = await invModel.addClassification(classification_name);
        console.log('📊 Classification result:', result);
        
        if (result.success) {
            req.flash('success', 'Classification \"' + classification_name + '\" added successfully!');
            res.redirect('/inv');
        } else {
            req.flash('error', 'Failed to add classification: ' + result.error);
            res.redirect('/inv/add-classification');
        }
    } catch (error) {
        console.error('❌ Error in addClassification:', error);
        req.flash('error', 'Error adding classification: ' + error.message);
        res.redirect('/inv/add-classification');
    }
};

// Build add inventory view
invController.buildAddInventory = async (req, res, next) => {
    try {
        console.log('🚗 Building add inventory view');
        console.log('Flash messages in add inventory:', res.locals.messages);
        const classifications = await invModel.getClassifications();
        
        const formData = req.flash('formData')[0] || {};
        console.log('📋 Form data for sticky form:', formData);
        
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
        console.log('➕ Adding inventory:', inventoryData);
        
        // Basic validation
        const required = ['inv_make', 'inv_model', 'inv_year', 'inv_price', 'classification_id'];
        for (let field of required) {
            if (!inventoryData[field] || inventoryData[field].toString().trim() === '') {
                req.flash('error', field.replace('inv_', '').toUpperCase() + ' is required');
                req.flash('formData', inventoryData);
                return res.redirect('/inv/add-inventory');
            }
        }
        
        const result = await invModel.addInventory(inventoryData);
        console.log('📊 Inventory result:', result);
        
        if (result.success) {
            req.flash('success', 'Vehicle \"' + inventoryData.inv_make + ' ' + inventoryData.inv_model + '\" added successfully!');
            res.redirect('/inv');
        } else {
            req.flash('error', 'Failed to add vehicle: ' + result.error);
            req.flash('formData', inventoryData);
            res.redirect('/inv/add-inventory');
        }
    } catch (error) {
        console.error('❌ Error in addInventory:', error);
        req.flash('error', 'Error adding vehicle: ' + error.message);
        req.flash('formData', req.body);
        res.redirect('/inv/add-inventory');
    }
};

module.exports = invController;
