const pool = require('../database/connection');

const accountModel = {};

/* ****************************************
 *  Register New Account
 * *************************************** */
accountModel.registerAccount = async function (account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password) VALUES (, , , ) RETURNING *";
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
    } catch (error) {
        console.error('Error in registerAccount:', error);
        return null;
    }
};

/* ****************************************
 *  Get Account by Email
 * *************************************** */
accountModel.getAccountByEmail = async function (account_email) {
    try {
        const sql = "SELECT account_id, account_firstname, account_lastname, account_email, account_password, account_type FROM account WHERE account_email = ";
        const result = await pool.query(sql, [account_email]);
        return result.rows[0];
    } catch (error) {
        console.error('Error in getAccountByEmail:', error);
        return null;
    }
};

/* ****************************************
 *  Get Account by ID (TASK 5)
 * *************************************** */
accountModel.getAccountById = async function (account_id) {
    try {
        const sql = "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = ";
        const result = await pool.query(sql, [account_id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error in getAccountById:', error);
        return null;
    }
};

/* ****************************************
 *  Update Account Information (TASK 5)
 * *************************************** */
accountModel.updateAccount = async function (account_id, account_firstname, account_lastname, account_email) {
    try {
        const sql = "UPDATE account SET account_firstname = , account_lastname = , account_email =  WHERE account_id =  RETURNING *";
        const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id]);
        return result.rowCount > 0;
    } catch (error) {
        console.error('Error in updateAccount:', error);
        return false;
    }
};

/* ****************************************
 *  Update Password (TASK 5)
 * *************************************** */
accountModel.updatePassword = async function (account_id, account_password) {
    try {
        const sql = "UPDATE account SET account_password =  WHERE account_id =  RETURNING *";
        const result = await pool.query(sql, [account_password, account_id]);
        return result.rowCount > 0;
    } catch (error) {
        console.error('Error in updatePassword:', error);
        return false;
    }
};

module.exports = accountModel;
