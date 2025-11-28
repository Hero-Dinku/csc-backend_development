const accountController = {};

// Build Login View
accountController.buildLogin = async function (req, res, next) {
    try {
        res.render('account/login', {
            title: 'Login - CSE Motors',
            messages: res.locals.messages
        });
    } catch (error) {
        next(error);
    }
};

// Build Registration View
accountController.buildRegister = async function (req, res, next) {
    try {
        res.render('account/register', {
            title: 'Register - CSE Motors',
            messages: res.locals.messages
        });
    } catch (error) {
        next(error);
    }
};

// Build Account Management View
accountController.buildManagement = async function (req, res, next) {
    try {
        // Get user data from session
        const userData = req.session.user ? {
            account_firstname: req.session.user.firstname,
            account_lastname: req.session.user.lastname,
            account_email: req.session.user.email
        } : {
            account_firstname: 'Guest',
            account_lastname: 'User',
            account_email: 'guest@example.com'
        };
        
        res.render('account/management', {
            title: 'Account Management - CSE Motors',
            messages: res.locals.messages,
            user: req.session.user
        });
    } catch (error) {
        next(error);
    }
};

// Build Update Account View
accountController.buildUpdateAccount = async function (req, res, next) {
    try {
        const userData = req.session.user ? {
            account_firstname: req.session.user.firstname,
            account_lastname: req.session.user.lastname,
            account_email: req.session.user.email
        } : {
            account_firstname: '',
            account_lastname: '',
            account_email: ''
        };
        
        res.render('account/update-account', {
            title: 'Update Account - CSE Motors',
            messages: res.locals.messages,
            userData: userData
        });
    } catch (error) {
        next(error);
    }
};

// Build Change Password View
accountController.buildChangePassword = async function (req, res, next) {
    try {
        res.render('account/change-password', {
            title: 'Change Password - CSE Motors',
            messages: res.locals.messages
        });
    } catch (error) {
        next(error);
    }
};

// Logout Function
accountController.logout = function (req, res) {
    console.log('🚪 Logout for user:', req.session.user?.email);
    req.session.destroy((err) => {
        if (err) {
            console.error('❌ Logout error:', err);
        }
        req.flash('success', 'You have been logged out successfully.');
        res.redirect('/');
    });
};

module.exports = accountController;
