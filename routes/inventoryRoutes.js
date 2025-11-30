const express = require('express');
const router = express.Router();
const { requireEmployeeOrAdmin } = require('../middleware/authMiddleware');

// Task 2 & 5: Inventory management route (protected for employees/admins)
router.get('/', requireEmployeeOrAdmin, (req, res) => {
    res.render('inventory/management', {
        title: 'Inventory Management',
        messages: req.flash()
    });
});

module.exports = router;
