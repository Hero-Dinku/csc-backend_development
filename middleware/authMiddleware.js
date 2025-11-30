const jwt = require('jsonwebtoken');

// JWT verification middleware - Task 5: Middleware for access control
const jwtAuth = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        req.loggedin = false;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.account = decoded;
        req.loggedin = true;
        req.accountId = decoded.account_id;
        req.accountType = decoded.account_type;
        next();
    } catch (error) {
        res.clearCookie('token');
        req.loggedin = false;
        next();
    }
};

// Authorization middleware for employee/admin - Task 5: Access control
const requireAuth = (req, res, next) => {
    if (!req.loggedin) {
        req.flash('notice', 'Please log in to access this page.');
        return res.redirect('/account/login');
    }
    next();
};

const requireEmployeeOrAdmin = (req, res, next) => {
    if (!req.loggedin || (req.accountType !== 'Employee' && req.accountType !== 'Admin')) {
        req.flash('notice', 'You do not have permission to access this page.');
        return res.redirect('/account/login');
    }
    next();
};

module.exports = { jwtAuth, requireAuth, requireEmployeeOrAdmin };
