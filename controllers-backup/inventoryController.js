const invModel = require('../models/inventory-model');
const utilities = require('../utilities');

const invCont = {};

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render('inventory/management', {
      title: 'Inventory Management',
      nav,
      message: res.locals.message || null,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build Add Classification View
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render('inventory/add-classification', {
      title: 'Add New Classification',
      nav,
      errors: null,
      message: res.locals.message || null,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Add New Classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;

  try {
    const result = await invModel.addClassification(classification_name);
    
    if (result) {
      req.flash('success', 'Classification added successfully!');
      res.redirect('/inv');
    } else {
      req.flash('error', 'Failed to add classification.');
      res.redirect('/inv/add-classification');
    }
  } catch (error) {
    req.flash('error', 'Error adding classification: ' + error.message);
    res.redirect('/inv/add-classification');
  }
};

/* ***************************
 *  Build Add Inventory View
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    
    res.render('inventory/add-inventory', {
      title: 'Add New Vehicle',
      nav,
      classificationList,
      errors: null,
      message: res.locals.message || null,
      formData: {},
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Add New Inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  } = req.body;

  try {
    const result = await invModel.addInventory({
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image: inv_image || '/images/vehicles/no-image.png',
      inv_thumbnail: inv_thumbnail || '/images/vehicles/no-image-tn.png',
      inv_price,
      inv_miles,
      inv_color
    });

    if (result) {
      req.flash('success', 'Vehicle added successfully!');
      res.redirect('/inv');
    } else {
      const nav = await utilities.getNav();
      const classificationList = await utilities.buildClassificationList(classification_id);
      
      res.render('inventory/add-inventory', {
        title: 'Add New Vehicle',
        nav,
        classificationList,
        errors: null,
        message: { type: 'error', message: 'Failed to add vehicle.' },
        formData: req.body,
      });
    }
  } catch (error) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(classification_id);
    
    res.render('inventory/add-inventory', {
      title: 'Add New Vehicle',
      nav,
      classificationList,
      errors: null,
      message: { type: 'error', message: 'Error adding vehicle: ' + error.message },
      formData: req.body,
    });
  }
};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  try {
    const nav = await utilities.getNav();
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let className = data[0]?.classification_name || "Unknown";
    res.render("inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build inventory by item view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId;
  try {
    const nav = await utilities.getNav();
    const data = await invModel.getInventoryById(inv_id);
    const grid = await utilities.buildVehicleDetail(data);
    let vehicleName = data[0]?.inv_make + " " + data[0]?.inv_model || "Vehicle";
    res.render("inventory/detail", {
      title: vehicleName,
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;
