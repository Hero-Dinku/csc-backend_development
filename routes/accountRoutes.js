const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountsController");

// GET routes
router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister);
router.get("/management", accountController.buildManagement);
router.get("/logout", accountController.processLogout);
router.get("/test-data", accountController.createTestData);

// POST routes
router.post("/login", accountController.processLogin);
router.post("/register", accountController.processRegister);

module.exports = router;
