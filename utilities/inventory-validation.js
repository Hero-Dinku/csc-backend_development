const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Classification name cannot contain spaces or special characters.")
      .custom(async (classification_name) => {
        const classificationExists = await invModel.checkExistingClassification(classification_name)
        if (classificationExists){
          throw new Error("Classification already exists. Please use a different name.")
        }
      }),
  ]
}

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

validate.inventoryRules = () => {
  return [
    body("classification_id").trim().escape().notEmpty().isInt().withMessage("Please select a classification."),
    body("inv_make").trim().escape().notEmpty().isLength({ min: 3 }).withMessage("Make must be at least 3 characters."),
    body("inv_model").trim().escape().notEmpty().isLength({ min: 3 }).withMessage("Model must be at least 3 characters."),
    body("inv_year").trim().escape().notEmpty().isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage("Please provide a valid 4-digit year."),
    body("inv_description").trim().escape().notEmpty().isLength({ min: 1 }).withMessage("Description is required."),
    body("inv_image").trim().notEmpty().isLength({ min: 1 }).withMessage("Image path is required."),
    body("inv_thumbnail").trim().notEmpty().isLength({ min: 1 }).withMessage("Thumbnail path is required."),
    body("inv_price").trim().escape().notEmpty().isDecimal().withMessage("Price must be a decimal or integer."),
    body("inv_miles").trim().escape().notEmpty().isInt().withMessage("Miles must be an integer."),
    body("inv_color").trim().escape().notEmpty().isLength({ min: 1 }).withMessage("Color is required."),
  ]
}

validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    })
    return
  }
  next()
}

validate.checkUpdateData = async (req, res, next) => {
  const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit Vehicle",
      nav,
      classificationList,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    })
    return
  }
  next()
}

module.exports = validate
