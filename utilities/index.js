// Real authentication middleware
const utilities = {};

/* ****************************************
 *  Check Login Status (REAL IMPLEMENTATION)
 * *************************************** */
utilities.checkLogin = (req, res, next) => {
    console.log('🔐 Checking login status for:', req.session.user?.email || 'No user');
    
    if (req.session.user) {
        // User is logged in
        res.locals.user = req.session.user;
        res.locals.loggedin = true;
        console.log('✅ User is logged in:', req.session.user.email);
        next();
    } else {
        // User is not logged in
        console.log('❌ User not logged in - redirecting to login');
        req.flash('error', 'Please log in to access this page.');
        res.redirect('/account/login');
    }
};

/* ****************************************
 *  Check Account Type for Inventory Management
 * *************************************** */
utilities.checkAccountType = (requiredTypes) => {
    return (req, res, next) => {
        console.log('👤 Checking account type for:', req.session.user?.email);
        
        if (!req.session.user) {
            req.flash('error', 'Please log in to access this page.');
            return res.redirect('/account/login');
        }
        
        if (requiredTypes.includes(req.session.user.type)) {
            res.locals.user = req.session.user;
            res.locals.loggedin = true;
            console.log('✅ Access granted for:', req.session.user.email);
            next();
        } else {
            console.log('❌ Access denied for:', req.session.user.email);
            req.flash('error', 'You do not have permission to access this page.');
            res.redirect('/account');
        }
    };
};

module.exports = utilities;
