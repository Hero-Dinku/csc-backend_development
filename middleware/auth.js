// middleware/auth.js
const jwt = require('jsonwebtoken');

/**
 * Check if user is authenticated via JWT
 */
function isAuthenticated(req, res, next) {
    try {
        // Get token from cookie
        const token = req.cookies.jwt;
        
        if (!token) {
            // User is not logged in
            req.user = null;
            return next();
        }
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user info to request
        req.user = {
            account_id: decoded.account_id,
            account_email: decoded.account_email,
            account_firstname: decoded.account_firstname,
            account_type: decoded.account_type
        };
        
        // Add user info to res.locals for views
        res.locals.user = req.user;
        
        next();
    } catch (error) {
        // Invalid token
        req.user = null;
        res.locals.user = null;
        res.clearCookie('jwt');
        next();
    }
}

/**
 * Require authentication (redirect to login if not authenticated)
 */
function requireAuth(req, res, next) {
    if (!req.user) {
        req.flash('error', 'Please login to access this page');
        return res.redirect('/account/login');
    }
    next();
}

/**
 * Check account type for authorization
 * @param {Array} allowedTypes - Array of allowed account types
 */
function checkAccountType(allowedTypes) {
    return (req, res, next) => {
        if (!req.user) {
            req.flash('error', 'Please login to access this page');
            return res.redirect('/account/login');
        }
        
        if (!allowedTypes.includes(req.user.account_type)) {
            req.flash('error', 'You do not have permission to access this page');
            return res.redirect('/account');
        }
        
        next();
    };
}

/**
 * Middleware for inventory management (Employee/Admin only)
 */
function requireInventoryAccess(req, res, next) {
    return checkAccountType(['Employee', 'Admin'])(req, res, next);
}

module.exports = {
    isAuthenticated,
    requireAuth,
    checkAccountType,
    requireInventoryAccess
};
