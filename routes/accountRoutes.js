const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/accountsController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validateAccountUpdate, validatePassword } = require('../middleware/validationMiddleware');

// Public routes
router.get('/login', accountsController.buildLogin);
router.post('/login', accountsController.accountLogin);
router.get('/register', accountsController.buildRegister);
router.post('/register', accountsController.registerAccount);
router.get('/test-data', accountsController.createTestData); // For testing

// Task 4 & 5: Protected routes with middleware
router.use(requireAuth);

router.get('/management', accountsController.buildManagement);
router.get('/update', accountsController.buildUpdate);
router.post('/update', validateAccountUpdate, accountsController.updateAccount);
router.post('/update-password', validatePassword, accountsController.updatePassword);
router.get('/logout', accountsController.logout);

module.exports = router;
