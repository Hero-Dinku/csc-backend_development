const utilities = require("../utilities");

const invController = {};

// Build inventory by classification view
invController.buildByClassificationId = async (req, res, next) => {
    try {
        const classification_id = req.params.classificationId;
        const grid = await utilities.buildClassificationGrid(classification_id);
        
        const classificationNames = {
            '1': 'Custom',
            '2': 'Sedan', 
            '3': 'SUV',
            '4': 'Truck'
        };
        
        res.render("inventory/classification", {
            title: classificationNames[classification_id] + " Vehicles",
            nav: await utilities.getNav(),
            grid
        });
    } catch (error) {
        next(error);
    }
};

// Build vehicle detail view
invController.buildByInventoryId = async (req, res, next) => {
    try {
        const inv_id = req.params.invId;
        const detailHTML = await utilities.buildVehicleDetail(parseInt(inv_id));
        
        const vehicleTitles = {
            '1': '1985 DMC Delorean',
            '2': '2019 Nissan Sentra SV',
            '3': '2022 Jeep Grand Cherokee', 
            '4': '2021 Ford F-150'
        };
        
        res.render("inventory/detail", {
            title: vehicleTitles[inv_id] || "Vehicle Details",
            nav: await utilities.getNav(),
            detailHTML
        });
    } catch (error) {
        next(error);
    }
};

module.exports = invController;
