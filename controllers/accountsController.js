const utilities = require("../utilities");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const accountController = {};

accountController.buildLogin = async (req, res) => {
    let nav = await utilities.getNav();
    res.render("account/login", {
        title: "Login",
        nav,
        messages: req.flash()
    });
};

accountController.processLogin = async (req, res) => {
    console.log("Login attempt for:", req.body.account_email);
    
    try {
        const { account_email, account_password } = req.body;
        
        const sql = "SELECT * FROM account WHERE account_email = $1";
        const result = await utilities.query(sql, [account_email]);
        
        if (result.rows.length === 0) {
            req.flash("error", "Invalid email or password.");
            return res.redirect("/account/login");
        }
        
        const user = result.rows[0];
        const valid = await bcrypt.compare(account_password, user.account_password);
        
        if (!valid) {
            req.flash("error", "Invalid email or password.");
            return res.redirect("/account/login");
        }
        
        const token = jwt.sign(
            {
                account_id: user.account_id,
                account_firstname: user.account_firstname,
                account_lastname: user.account_lastname,
                account_email: user.account_email,
                account_type: user.account_type
            },

accountController.buildRegister = async (req, res) => {
    let nav = await utilities.getNav();
    res.render("account/registration", {
        title: "Register",
        nav,
        messages: req.flash()
    });
},

accountController.processRegister = async (req, res) => {
    console.log("Registration attempt for:", req.body.account_email);
    
    try {
        const { account_firstname, account_lastname, account_email, account_password } = req.body;
        
        // Check if email exists
        const sql = "SELECT account_email FROM account WHERE account_email = " + "$1";
        const existing = await utilities.query(sql, [account_email]);
        
        if (existing.rows.length > 0) {
            req.flash("error", "An account with this email already exists.");
            return res.redirect("/account/register");
        }
        
        // Simple validation
        if (!account_firstname || account_firstname.trim().length < 2) {
            req.flash("error", "First name must be at least 2 characters.");
            return res.redirect("/account/register");
        }
        
        if (!account_lastname || account_lastname.trim().length < 2) {
            req.flash("error", "Last name must be at least 2 characters.");
            return res.redirect("/account/register");
        }
        
        if (!account_email || !account_email.includes("@")) {
            req.flash("error", "Please enter a valid email address.");
            return res.redirect("/account/register");
        }
        
        if (!account_password || account_password.length < 8) {
            req.flash("error", "Password must be at least 8 characters.");
            return res.redirect("/account/register");
        }
        
        // Create account
        const hashedPassword = await bcrypt.hash(account_password, 10);
        const insertSql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES (" + "$" + "1, " + "$" + "2, " + "$" + "3, " + "$" + "4, " + "$" + "5)";
        
        await utilities.query(insertSql, [
            account_firstname.trim(),
            account_lastname.trim(),
            account_email,
            hashedPassword,
            "Client"
        ]);
        
        req.flash("success", "Account created successfully! Please log in.");
        res.redirect("/account/login");
        
    } catch (error) {
        console.error("Registration error:", error);
        req.flash("error", "Registration failed. Please try again.");
        res.redirect("/account/register");
    }
},
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" }
        );
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000
        });
        
        req.flash("success", "Login successful!");
        res.redirect("/account/management");
        
    } catch (error) {
        console.error("Login error:", error);
        req.flash("error", "Login failed.");
        res.redirect("/account/login");
    }
};

accountController.buildManagement = async (req, res) => {
    if (!req.loggedin) {
        req.flash("error", "Please login first");
        return res.redirect("/account/login");
    }
    
    let nav = await utilities.getNav();
    res.render("account/management", {
        title: "Account Management",
        nav,
        account: req.account,
        messages: req.flash()
    });
};

accountController.processLogout = (req, res) => {
    res.clearCookie("token");
    req.flash("success", "Logged out");
    res.redirect("/");
};

accountController.createTestData = async (req, res) => {
    try {
        const sql = "SELECT account_id FROM account WHERE account_email = " + "$1";
        const existing = await utilities.query(sql, ["test@example.com"]);
        
        if (existing.rows.length === 0) {
            const hashedPassword = await bcrypt.hash("Test123!", 10);
            const insertSql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES (" + "$" + "1, " + "$" + "2, " + "$" + "3, " + "$" + "4, " + "$" + "5)";
            await utilities.query(insertSql, ["Test", "User", "test@example.com", hashedPassword, "Client"]);
            req.flash("success", "Test account created: test@example.com / Test123!");
        } else {
            req.flash("info", "Test account exists: test@example.com / Test123!");
        }
        
        res.redirect("/account/login");
    } catch (error) {
        console.error("Test data error:", error);
        req.flash("error", "Error creating test data");
        res.redirect("/");
    }
};

module.exports = accountController;
