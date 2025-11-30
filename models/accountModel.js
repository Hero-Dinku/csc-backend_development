const utilities = require('../utilities');
const bcrypt = require('bcryptjs');

const accountModel = {
    // Task 6: Get account by ID with prepared statement
    async getAccountById(account_id) {
        try {
            const data = await utilities.query(
                'SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = ',
                [account_id]
            );
            return data.rows[0];
        } catch (error) {
            console.error('getAccountById error:', error);
            throw new Error('Error retrieving account information');
        }
    },

    // Task 6 & 7: Update account with prepared statement
    async updateAccount(account_id, account_firstname, account_lastname, account_email) {
        try {
            const result = await utilities.query(
                'UPDATE account SET account_firstname = , account_lastname = , account_email =  WHERE account_id =  RETURNING account_id, account_firstname, account_lastname, account_email, account_type',
                [account_firstname, account_lastname, account_email, account_id]
            );
            return result.rows[0];
        } catch (error) {
            console.error('updateAccount error:', error);
            throw new Error('Error updating account information');
        }
    },

    // Task 6 & 7: Update password with prepared statement
    async updatePassword(account_id, account_password) {
        try {
            const hashedPassword = await bcrypt.hash(account_password, 10);
            
            const result = await utilities.query(
                'UPDATE account SET account_password =  WHERE account_id =  RETURNING account_id',
                [hashedPassword, account_id]
            );
            return result.rows[0];
        } catch (error) {
            console.error('updatePassword error:', error);
            throw new Error('Error updating password');
        }
    },

    async getAccountByEmail(account_email) {
        try {
            const result = await utilities.query(
                'SELECT account_id, account_firstname, account_lastname, account_email, account_password, account_type FROM account WHERE account_email = ',
                [account_email]
            );
            return result.rows[0];
        } catch (error) {
            console.error('getAccountByEmail error:', error);
            throw new Error('Error retrieving account');
        }
    },

    // New: Register new account
    async registerAccount(account_firstname, account_lastname, account_email, account_password) {
        try {
            // Check if email already exists
            const existingAccount = await utilities.query(
                'SELECT account_id FROM account WHERE account_email = ',
                [account_email]
            );
            
            if (existingAccount.rows.length > 0) {
                throw new Error('Email already exists');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(account_password, 10);
            
            // Insert new account
            const result = await utilities.query(
                'INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES (, , , , ) RETURNING account_id, account_firstname, account_lastname, account_email, account_type',
                [account_firstname, account_lastname, account_email, hashedPassword, 'Client']
            );
            
            return result.rows[0];
        } catch (error) {
            console.error('registerAccount error:', error);
            throw new Error(error.message || 'Error creating account');
        }
    },

    // For testing - create a test account
    async createTestAccount() {
        try {
            const hashedPassword = await bcrypt.hash('Test123!', 10);
            const result = await utilities.query(
                'INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES (, , , , ) ON CONFLICT (account_email) DO NOTHING RETURNING account_id',
                ['Test', 'User', 'test@example.com', hashedPassword, 'Client']
            );
            return result.rows[0];
        } catch (error) {
            console.error('createTestAccount error:', error);
            // Account might already exist
        }
    }
};

module.exports = accountModel;
