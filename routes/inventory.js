const express = require("express");
const router = express.Router();
const invController = require("../controllers/inventoryController");

// Classification route
router.get("/classification/:classificationId", invController.buildByClassificationId);

// Vehicle detail route
router.get("/detail/:invId", invController.buildByInventoryId);

// Error test route
router.get("/error-test", (req, res, next) => {
    const error = new Error("Intentional 500 Error - Test");
    error.status = 500;
    next(error);
});

module.exports = router;
