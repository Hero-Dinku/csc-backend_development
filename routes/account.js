const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const accountController = require('../controllers/accountController');
const accountModel = require('../models/account-model');
const utilities = require('../utilities');

// GET Routes
router.get('/login', accountController.buildLogin);
router.get('/register', accountController.buildRegister);
router.get('/', utilities.checkLogin, accountController.buildManagement);
router.get('/update', utilities.checkLogin, accountController.buildUpdateAccount);
router.get('/change-password', utilities.checkLogin, accountController.buildChangePassword);
router.get('/logout', accountController.logout);

// POST Routes
router.post('/register', async (req, res) => {
    try {
        const { account_firstname, account_lastname, account_email, account_password } = req.body;
        
        console.log('Registration attempt:', { account_firstname, account_lastname, account_email });
        
        // Basic validation
        if (!account_firstname || !account_lastname || !account_email || !account_password) {
            req.flash('error', 'All fields are required');
            return res.redirect('/account/register');
        }
        
        // Check if email already exists
        const existingUser = await accountModel.getAccountByEmail(account_email);
        if (existingUser) {
            req.flash('error', 'Email already exists. Please use a different email.');
            return res.redirect('/account/register');
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(account_password, 10);
        
        // Register account in database
        const result = await accountModel.registerAccount(
            account_firstname, 
            account_lastname, 
            account_email, 
            hashedPassword
        );
        
        if (result && result.rows && result.rows[0]) {
            console.log('User registered successfully:', result.rows[0].account_email);
            req.flash('success', 'Account created successfully! Please login.');
            res.redirect('/account/login');
        } else {
            req.flash('error', 'Registration failed. Please try again.');
            res.redirect('/account/register');
        }
    } catch (error) {
        console.error('Registration error:', error);
        req.flash('error', 'Registration failed. Please try again.');
        res.redirect('/account/register');
    }
});

router.post('/login', async (req, res) => {
    try {
        const { account_email, account_password } = req.body;
        
        console.log('Login attempt for:', account_email);
        
        if (!account_email || !account_password) {
            req.flash('error', 'Email and password are required');
            return res.redirect('/account/login');
        }
        
        // Get user from database
        const user = await accountModel.getAccountByEmail(account_email);
        
        if (user && await bcrypt.compare(account_password, user.account_password)) {
            // Create session
            req.session.user = {
                id: user.account_id,
                firstname: user.account_firstname,
                lastname: user.account_lastname,
                email: user.account_email,
                type: user.account_type
            };
            
            console.log('Login successful for:', user.account_email);
            req.flash('success', 'Welcome back, ' + user.account_firstname + '!');
            res.redirect('/account');
        } else {
            console.log('Login failed for:', account_email);
            req.flash('error', 'Invalid email or password');
            res.redirect('/account/login');
        }
    } catch (error) {
        console.error('Login error:', error);
        req.flash('error', 'Login failed. Please try again.');
        res.redirect('/account/login');
    }
});

router.post('/update', utilities.checkLogin, async (req, res) => {
    try {
        const { account_firstname, account_lastname, account_email } = req.body;
        const userId = req.session.user.id;
        
        console.log('Update account attempt for user:', userId);
        
        const success = await accountModel.updateAccount(
            userId, 
            account_firstname, 
            account_lastname, 
            account_email
        );
        
        if (success) {
            // Update session data
            req.session.user.firstname = account_firstname;
            req.session.user.lastname = account_lastname;
            req.session.user.email = account_email;
            
            req.flash('success', 'Account information updated successfully!');
        } else {
            req.flash('error', 'Failed to update account information');
        }
    } catch (error) {
        console.error('Update account error:', error);
        req.flash('error', 'Error updating account information');
    }
    res.redirect('/account');
});

router.post('/change-password', utilities.checkLogin, async (req, res) => {
    try {
        const { current_password, new_password } = req.body;
        const userId = req.session.user.id;
        
        console.log('Change password attempt for user:', userId);
        
        // Get user to verify current password
        const user = await accountModel.getAccountById(userId);
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/account');
        }
        
        // Verify current password
        const isValidPassword = await bcrypt.compare(current_password, user.account_password);
        if (!isValidPassword) {
            req.flash('error', 'Current password is incorrect');
            return res.redirect('/account/change-password');
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(new_password, 10);
        
        // Update password in database
        const success = await accountModel.updatePassword(userId, hashedPassword);
        
        if (success) {
            req.flash('success', 'Password changed successfully!');
            res.redirect('/account');
        } else {
            req.flash('error', 'Failed to change password');
            res.redirect('/account/change-password');
        }
    } catch (error) {
        console.error('Change password error:', error);
        req.flash('error', 'Error changing password');
        res.redirect('/account/change-password');
    }
});

module.exports = router;
