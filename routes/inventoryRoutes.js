// routes/inventoryRoutes.js - FIXED VERSION
const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middleware/authMiddleware');

// Task 2 & 5: Inventory management route (protected for employees/admins)
router.get('/', requireLogin, (req, res) => {
    // Check if user is employee or admin
    if (req.account && (req.account.account_type === 'Employee' || req.account.account_type === 'Admin')) {
        res.render('inventory/management', {
            title: 'Inventory Management',
            messages: req.flash()
        });
    } else {
        req.flash('error', 'You do not have permission to access inventory management.');
        res.redirect('/account/management');
    }
});

module.exports = router;
