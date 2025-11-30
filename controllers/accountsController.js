const accountModel = require('../models/accountModel');
const utilities = require('../utilities');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const accountsController = {
    // Task 3: Build account management with proper greeting
    async buildManagement(req, res) {
        try {
            const accountData = await accountModel.getAccountById(req.accountId);
            
            let nav = await utilities.getNav();
            res.render('account/management', {
                title: 'Account Management',
                nav,
                account: accountData,
                errors: null,
                messages: req.flash()
            });
        } catch (error) {
            req.flash('notice', 'Error retrieving account information.');
            res.redirect('/');
        }
    },

    // Build account update view
    async buildUpdate(req, res) {
        try {
            const accountData = await accountModel.getAccountById(req.accountId);
            
            let nav = await utilities.getNav();
            res.render('account/update', {
                title: 'Update Account',
                nav,
                account: accountData,
                errors: null,
                messages: req.flash()
            });
        } catch (error) {
            req.flash('notice', 'Error retrieving account information.');
            res.redirect('/account/management');
        }
    },

    // Build registration view
    async buildRegister(req, res) {
        let nav = await utilities.getNav();
        res.render('account/registration', {
            title: 'Register Account',
            nav,
            errors: null,
            messages: req.flash()
        });
    },

    // Register new account with enhanced validation
    async registerAccount(req, res) {
        try {
            const { account_firstname, account_lastname, account_email, account_password, account_password_confirm } = req.body;
            
            // Server-side validation
            let errors = [];
            
            if (!account_firstname || account_firstname.length < 2) {
                errors.push('First name must be at least 2 characters long.');
            }
            
            if (!account_lastname || account_lastname.length < 2) {
                errors.push('Last name must be at least 2 characters long.');
            }
            
            if (!account_email) {
                errors.push('Email is required.');
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(account_email)) {
                    errors.push('Please provide a valid email address.');
                }
            }
            
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
            
            // Password confirmation validation
            if (!account_password_confirm) {
                errors.push('Please confirm your password.');
            } else if (account_password !== account_password_confirm) {
                errors.push('Passwords do not match.');
            }
            
            if (errors.length > 0) {
                // Return form data to maintain sticky form
                req.flash('errors', errors);
                req.flash('account_firstname', account_firstname);
                req.flash('account_lastname', account_lastname);
                req.flash('account_email', account_email);
                return res.redirect('/account/register');
            }
            
            // Create account
            const newAccount = await accountModel.registerAccount(
                account_firstname,
                account_lastname,
                account_email,
                account_password
            );

            // Task 8: Create JWT token for auto-login after registration
            const token = jwt.sign(
                {
                    account_id: newAccount.account_id,
                    account_firstname: newAccount.account_firstname,
                    account_lastname: newAccount.account_lastname,
                    account_email: newAccount.account_email,
                    account_type: newAccount.account_type
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            req.flash('success', 'Account created successfully! Welcome ' + newAccount.account_firstname + '! You have been automatically logged in.');
            res.redirect('/account/management');
        } catch (error) {
            if (error.message === 'Email already exists') {
                req.flash('error', 'An account with this email address already exists. Please use a different email or try logging in.');
            } else {
                req.flash('error', 'Error creating account. Please try again. If the problem persists, contact support.');
            }
            // Return form data to maintain sticky form
            req.flash('account_firstname', req.body.account_firstname);
            req.flash('account_lastname', req.body.account_lastname);
            req.flash('account_email', req.body.account_email);
            res.redirect('/account/register');
        }
    },

    // Task 4: Update account information
    async updateAccount(req, res) {
        try {
            const { account_firstname, account_lastname, account_email } = req.body;
            
            const updatedAccount = await accountModel.updateAccount(
                req.accountId,
                account_firstname,
                account_lastname,
                account_email
            );

            // Task 8: Update JWT token with new information
            const token = jwt.sign(
                {
                    account_id: updatedAccount.account_id,
                    account_firstname: updatedAccount.account_firstname,
                    account_lastname: updatedAccount.account_lastname,
                    account_email: updatedAccount.account_email,
                    account_type: updatedAccount.account_type
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            req.flash('success', 'Account information updated successfully.');
            res.redirect('/account/management');
        } catch (error) {
            req.flash('error', 'Error updating account information.');
            res.redirect('/account/update');
        }
    },

    // Task 4: Update password
    async updatePassword(req, res) {
        try {
            const { account_password } = req.body;
            
            await accountModel.updatePassword(req.accountId, account_password);
            
            req.flash('success', 'Password updated successfully.');
            res.redirect('/account/management');
        } catch (error) {
            req.flash('error', 'Error updating password.');
            res.redirect('/account/update');
        }
    },

    // Task 9: Logout process
    async logout(req, res) {
        res.clearCookie('token');
        req.flash('success', 'You have been successfully logged out. Please sign in again to access your account.');
        res.redirect('/account/login');
    },

    async buildLogin(req, res) {
        let nav = await utilities.getNav();
        res.render('account/login', {
            title: 'Login',
            nav,
            errors: null,
            messages: req.flash()
        });
    },

    // Task 8: JWT token creation and login with better error handling
    async accountLogin(req, res) {
        try {
            const { account_email, account_password } = req.body;
            
            // Basic validation
            if (!account_email || !account_password) {
                req.flash('error', 'Please enter both email and password.');
                return res.redirect('/account/login');
            }

            const account = await accountModel.getAccountByEmail(account_email);
            
            if (!account) {
                req.flash('error', 'Invalid email or password. Please try again.');
                // Keep email for sticky form
                req.flash('account_email', account_email);
                return res.redirect('/account/login');
            }

            const isMatch = await bcrypt.compare(account_password, account.account_password);
            if (!isMatch) {
                req.flash('error', 'Invalid email or password. Please try again.');
                // Keep email for sticky form
                req.flash('account_email', account_email);
                return res.redirect('/account/login');
            }

            // Task 8: Create JWT token
            const token = jwt.sign(
                {
                    account_id: account.account_id,
                    account_firstname: account.account_firstname,
                    account_lastname: account.account_lastname,
                    account_email: account.account_email,
                    account_type: account.account_type
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            req.flash('success', 'Welcome back ' + account.account_firstname + '! You have been successfully logged in.');
            res.redirect('/account/management');
        } catch (error) {
            req.flash('error', 'An error occurred during login. Please try again.');
            res.redirect('/account/login');
        }
    },

    // For testing - create test data
    async createTestData(req, res) {
        try {
            await accountModel.createTestAccount();
            req.flash('success', 'Test account created successfully! You can now login with: test@example.com / Test123!');
            res.redirect('/account/login');
        } catch (error) {
            req.flash('notice', 'Test account already exists. You can login with: test@example.com / Test123!');
            res.redirect('/account/login');
        }
    }
};

module.exports = accountsController;
