const jwt = require('jsonwebtoken');
const utilities = require('../utilities');

const jwtAuth = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies?.token || req.cookies?.jwt;
        
        if (!token) {
            req.loggedin = false;
            req.account = null;
            return next();
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'FallbackSecret');
        
        // Get fresh account data from database
        const result = await utilities.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = ',
            [decoded.account_id]
        );

        if (result.rows.length === 0) {
            // Invalid account - clear cookie
            res.clearCookie('token');
            req.loggedin = false;
            req.account = null;
            return next();
        }

        // Attach account data to request
        req.account = result.rows[0];
        req.loggedin = true;
        
        // Make account data available to views via res.locals
        res.locals.account = req.account;
        res.locals.loggedin = req.loggedin;
        res.locals.account_firstname = req.account.account_firstname;
        res.locals.account_type = req.account.account_type;
        
        next();
    } catch (error) {
        console.error('JWT Auth Error:', error.message);
        
        // Clear invalid token
        res.clearCookie('token');
        req.loggedin = false;
        req.account = null;
        res.locals.loggedin = false;
        res.locals.account = null;
        
        next();
    }
};

// Middleware to require login
const requireLogin = (req, res, next) => {
    if (!req.loggedin) {
        req.flash('error', 'Please log in to access this page.');
        return res.redirect('/account/login');
    }
    next();
};

// Middleware to check account type
const requireAdmin = (req, res, next) => {
    if (!req.loggedin) {
        req.flash('error', 'Please log in to access this page.');
        return res.redirect('/account/login');
    }
    
    if (req.account.account_type !== 'Admin' && req.account.account_type !== 'Employee') {
        req.flash('error', 'You do not have permission to access this page.');
        return res.redirect('/account/management');
    }
    
    next();
};

module.exports = { jwtAuth, requireLogin, requireAdmin };
