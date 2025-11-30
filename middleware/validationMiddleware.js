const utilities = require("../utilities");
const bcrypt = require('bcryptjs');

// Task 10: Server-side validation
const validateAccountUpdate = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body;
    let errors = [];

    if (!account_firstname) errors.push('First name is required.');
    if (!account_lastname) errors.push('Last name is required.');
    if (!account_email) errors.push('Email is required.');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (account_email && !emailRegex.test(account_email)) {
        errors.push('Please provide a valid email address.');
    }

    // Check if email already exists (excluding current account)
    if (account_email && req.accountId) {
        try {
            const existingAccount = await utilities.query(
                'SELECT * FROM account WHERE account_email =  AND account_id != ',
                [account_email, req.accountId]
            );
            if (existingAccount.rows.length > 0) {
                errors.push('Email address is already in use.');
            }
        } catch (error) {
            console.error('Error checking email:', error);
        }
    }

    if (errors.length > 0) {
        req.flash('errors', errors);
        return res.redirect('/account/update');
    }

    next();
};

const validatePassword = (req, res, next) => {
    const { account_password } = req.body;
    let errors = [];

    if (!account_password) {
        errors.push('Password is required.');
    } else {
        if (account_password.length < 8) {
            errors.push('Password must be at least 8 characters long.');
        }
        if (!/(?=.*[a-z])/.test(account_password)) {
            errors.push('Password must contain at least one lowercase letter.');
        }
        if (!/(?=.*[A-Z])/.test(account_password)) {
            errors.push('Password must contain at least one uppercase letter.');
        }
        if (!/(?=.*[0-9])/.test(account_password)) {
            errors.push('Password must contain at least one number.');
        }
        if (!/(?=.*[!@#$%^&*])/.test(account_password)) {
            errors.push('Password must contain at least one special character.');
        }
    }

    if (errors.length > 0) {
        req.flash('errors', errors);
        return res.redirect('/account/update');
    }

    next();
};

module.exports = { validateAccountUpdate, validatePassword };
