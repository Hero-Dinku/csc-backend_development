const invModel = require('../models/inventory-model');

const utilities = {};

// Get navigation
utilities.getNav = async () => {
    try {
        const data = await invModel.getClassifications();
        let navHTML = '<nav class=\"navbar\"><ul><li><a href=\"/\" title=\"Home\">Home</a></li>';
        
        data.forEach(row => {
            navHTML += '<li><a href=\"/inv/classification/' + row.classification_id + '\" title=\"' + row.classification_name + '\">' + row.classification_name + '</a></li>';
        });
        
        navHTML += '</ul></nav>';
        return navHTML;
    } catch (error) {
        console.error('Error getting navigation:', error);
        return '<nav class=\"navbar\"><ul><li><a href=\"/\" title=\"Home\">Home</a></li></ul></nav>';
    }
};

// Build classification list for forms
utilities.buildClassificationList = async function(classification_id = null) {
    try {
        const data = await invModel.getClassifications();
        let classificationList = '<select name=\"classification_id\" id=\"classificationList\" required>';
        classificationList += '<option value=\"\">Choose a Classification</option>';
        
        data.forEach(row => {
            classificationList += '<option value=\"' + row.classification_id + '\"';
            if (classification_id != null && row.classification_id == classification_id) {
                classificationList += ' selected';
            }
            classificationList += '>' + row.classification_name + '</option>';
        });
        
        classificationList += '</select>';
        return classificationList;
    } catch (error) {
        throw error;
    }
};

// Build classification grid
utilities.buildClassificationGrid = async function(classificationId) {
    try {
        const data = await invModel.getVehiclesByClassificationId(classificationId);
        let grid = '<div class=\"classification-grid\">';
        
        if (data.length > 0) {
            data.forEach(vehicle => {
                grid += '<div class=\"vehicle-card\">' +
                    '<a href=\"/inv/detail/' + vehicle.inv_id + '\">' +
                    '<img src=\"' + vehicle.inv_thumbnail + '\" alt=\"' + vehicle.inv_make + ' ' + vehicle.inv_model + '\" loading=\"lazy\">' +
                    '<div class=\"vehicle-info\">' +
                    '<h3>' + vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h3>' +
                    '<p class=\"price\">' + utilities.formatPrice(vehicle.inv_price) + '</p>' +
                    '</div>' +
                    '</a>' +
                    '</div>';
            });
        } else {
            grid += '<p>No vehicles found in this classification.</p>';
        }
        
        grid += '</div>';
        return grid;
    } catch (error) {
        throw error;
    }
};

// Build vehicle detail
utilities.buildVehicleDetail = async function(invId) {
    try {
        const vehicle = await invModel.getVehicleById(invId);
        
        if (!vehicle) {
            return '<p>Vehicle not found.</p>';
        }

        const detailHTML = '<div class=\"vehicle-detail-container\">' +
            '<div class=\"vehicle-image\">' +
            '<img src=\"' + vehicle.inv_image + '\" alt=\"' + vehicle.inv_make + ' ' + vehicle.inv_model + '\" loading=\"lazy\">' +
            '</div>' +
            '<div class=\"vehicle-info\">' +
            '<h2>' + vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h2>' +
            '<p class=\"price\">' + utilities.formatPrice(vehicle.inv_price) + '</p>' +
            '<p class=\"description\">' + vehicle.inv_description + '</p>' +
            
            '<div class=\"vehicle-specs\">' +
            '<div class=\"spec-row\">' +
            '<span class=\"spec-label\">Mileage:</span>' +
            '<span class=\"spec-value\">' + utilities.formatMileage(vehicle.inv_miles) + ' miles</span>' +
            '</div>' +
            '<div class=\"spec-row\">' +
            '<span class=\"spec-label\">Color:</span>' +
            '<span class=\"spec-value\">' + vehicle.inv_color + '</span>' +
            '</div>' +
            '<div class=\"spec-row\">' +
            '<span class=\"spec-label\">Year:</span>' +
            '<span class=\"spec-value\">' + vehicle.inv_year + '</span>' +
            '</div>' +
            '</div>' +
            
            '<div class=\"action-buttons\">' +
            '<button class=\"btn-primary\">Start My Purchase</button>' +
            '<button class=\"btn-secondary\">Schedule Test Drive</button>' +
            '<button class=\"btn-secondary\">Apply for Financing</button>' +
            '</div>' +
            
            '<div class=\"contact-info\">' +
            '<h3>Contact Us</h3>' +
            '<p>Call Us: <strong>800-396-7886</strong></p>' +
            '<p>Visit Us: 123 Car Street, Auto City, ST 12345</p>' +
            '</div>' +
            '</div>' +
            '</div>';
        
        return detailHTML;
    } catch (error) {
        throw error;
    }
};

// Validation functions
utilities.checkClassificationName = function(classification_name) {
    const classificationRegex = /^[a-zA-Z0-9]+$/;
    return classificationRegex.test(classification_name);
};

utilities.checkInventoryData = function(vehicleData) {
    const errors = [];
    
    if (!vehicleData.inv_make || vehicleData.inv_make.length < 1) {
        errors.push('Make is required');
    }
    if (!vehicleData.inv_model || vehicleData.inv_model.length < 1) {
        errors.push('Model is required');
    }
    if (!vehicleData.inv_year || vehicleData.inv_year.length !== 4 || isNaN(vehicleData.inv_year)) {
        errors.push('Year must be a 4-digit number');
    }
    if (!vehicleData.inv_description || vehicleData.inv_description.length < 1) {
        errors.push('Description is required');
    }
    if (!vehicleData.inv_price || isNaN(vehicleData.inv_price) || vehicleData.inv_price <= 0) {
        errors.push('Price must be a positive number');
    }
    if (!vehicleData.inv_miles || isNaN(vehicleData.inv_miles) || vehicleData.inv_miles < 0) {
        errors.push('Miles must be a non-negative number');
    }
    if (!vehicleData.inv_color || vehicleData.inv_color.length < 1) {
        errors.push('Color is required');
    }
    if (!vehicleData.classification_id || isNaN(vehicleData.classification_id)) {
        errors.push('Classification is required');
    }
    
    return errors;
};

// Format price with USD symbol and commas
utilities.formatPrice = function(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};

// Format mileage with commas
utilities.formatMileage = function(mileage) {
    return new Intl.NumberFormat('en-US').format(mileage);
};

module.exports = utilities;
