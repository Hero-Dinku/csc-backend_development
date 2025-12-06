const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database
const pool = require("./config/database");

// Activity Model
const activityModel = require("./models/activityModel");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Auth middleware
function authMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect("/login");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        req.user = decoded;
        next();
    } catch (err) {
        res.clearCookie("token");
        res.redirect("/login");
    }
}

// ===== ROUTES =====

// Home
app.get("/", (req, res) => {
    const token = req.cookies.token;
    let user = null;

    if (token) {
        try {
            user = jwt.verify(token, process.env.JWT_SECRET || "secret");
        } catch (err) {
            res.clearCookie("token");
        }
    }

    res.render("index", { title: "Home", user });
});

// Login
app.get("/login", (req, res) => {
    res.render("login", { title: "Login", error: null });
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.render("login", {
                title: "Login",
                error: "Email and password are required"
            });
        }
        
        const result = await pool.query(
            "SELECT * FROM account WHERE account_email = $1",
            [email]
        );
        
        if (result.rows.length === 0) {
            return res.render("login", {
                title: "Login",
                error: "Invalid email or password"
            });
        }
        
        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.account_password);
        
        if (!validPassword) {
            return res.render("login", {
                title: "Login",
                error: "Invalid email or password"
            });
        }
        
        // Update last_login
        await pool.query(
            "UPDATE account SET last_login = NOW() WHERE account_id = $1",
            [user.account_id]
        );
        
        // Log activity
        await activityModel.logActivity(
            user.account_id,
            "LOGIN",
            "User logged in successfully",
            req.ip,
            req.headers["user-agent"]
        );
        
        // Create JWT
        const token = jwt.sign(
            {
                account_id: user.account_id,
                account_firstname: user.account_firstname,
                account_lastname: user.account_lastname,
                account_email: user.account_email,
                account_type: user.account_type
            },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" }
        );
        
        res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
        
        // Redirect with success message
        res.redirect("/account/management?success=Login+successful!");
        
    } catch (error) {
        console.error("Login error:", error);
        res.render("login", {
            title: "Login",
            error: "Server error"
        });
    }
});

// Account Management
app.get("/account/management", authMiddleware, async (req, res) => {
    try {
        const showGreeting = req.user.account_type !== "Client";
        
        // Get fresh data
        const userData = await pool.query(
            "SELECT last_login FROM account WHERE account_id = $1",
            [req.user.account_id]
        );
        
        // Get recent activities
        const recentActivities = await activityModel.getUserActivities(req.user.account_id, 5);
        
        const userWithData = {
            ...req.user,
            last_login: userData.rows[0]?.last_login
        };
        
        // Pass success and error from query params
        const success = req.query.success || null;
        const error = req.query.error || null;
        
        res.render("account/management", {
            title: "Account Management",
            user: userWithData,
            showGreeting: showGreeting,
            success: success,
            error: error,
            recentActivities: recentActivities
        });
        
    } catch (error) {
        console.error("Account management error:", error);
        res.status(500).render("error", { message: "Server error", user: req.user });
    }
});

// Update Account
app.get("/account/update", authMiddleware, (req, res) => {
    res.render("account/update", {
        title: "Update Account",
        user: req.user,
        error: null
    });
});

app.post("/account/update", authMiddleware, async (req, res) => {
    try {
        const { firstname, lastname, email } = req.body;
        const userId = req.user.account_id;
        
        if (!firstname || !lastname || !email) {
            return res.render("account/update", {
                title: "Update Account",
                user: req.user,
                error: "All fields are required"
            });
        }
        
        const result = await pool.query(
            "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *",
            [firstname, lastname, email, userId]
        );
        
        const updatedUser = result.rows[0];
        const token = jwt.sign(
            {
                account_id: updatedUser.account_id,
                account_firstname: updatedUser.account_firstname,
                account_lastname: updatedUser.account_lastname,
                account_email: updatedUser.account_email,
                account_type: updatedUser.account_type
            },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" }
        );
        
        res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

        // Log activity
        await activityModel.logActivity(
            userId,
            "UPDATE_ACCOUNT",
            "Updated: " + firstname + " " + lastname,
            req.ip,
            req.headers["user-agent"]
        );

        res.redirect("/account/management?success=Account+updated+successfully!");
        
    } catch (error) {
        console.error("Update error:", error);
        res.render("account/update", {
            title: "Update Account",
            user: req.user,
            error: "Update failed"
        });
    }
});

// Update Password
app.get("/account/update-password", authMiddleware, (req, res) => {
    res.render("account/update-password", {
        title: "Update Password",
        user: req.user,
        error: null
    });
});

app.post("/account/update-password", authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const userId = req.user.account_id;
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.render("account/update-password", {
                title: "Update Password",
                user: req.user,
                error: "All fields are required"
            });
        }
        
        if (newPassword !== confirmPassword) {
            return res.render("account/update-password", {
                title: "Update Password",
                user: req.user,
                error: "New passwords do not match"
            });
        }
        
        const result = await pool.query(
            "SELECT account_password FROM account WHERE account_id = $1",
            [userId]
        );
        
        const user = result.rows[0];
        const validPassword = await bcrypt.compare(currentPassword, user.account_password);
        
        if (!validPassword) {
            return res.render("account/update-password", {
                title: "Update Password",
                user: req.user,
                error: "Current password is incorrect"
            });
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await pool.query(
            "UPDATE account SET account_password = $1 WHERE account_id = $2",
            [hashedPassword, userId]
        );

        // Log activity
        await activityModel.logActivity(
            userId,
            "UPDATE_PASSWORD",
            "Password changed successfully",
            req.ip,
            req.headers["user-agent"]
        );

        res.redirect("/account/management?success=Password+changed+successfully!");
        
    } catch (error) {
        console.error("Password update error:", error);
        res.render("account/update-password", {
            title: "Update Password",
            user: req.user,
            error: "Password update failed"
        });
    }
});

// Activity Log
app.get("/account/activity-log", authMiddleware, async (req, res) => {
    try {
        const activities = await activityModel.getUserActivities(req.user.account_id, 20);
        
        // Pass success and error from query params
        const success = req.query.success || null;
        const error = req.query.error || null;
        
        res.render("account/activity-log", {
            title: "Activity Log",
            user: req.user,
            activities: activities,
            success: success,
            error: error
        });
    } catch (error) {
        console.error("Activity log error:", error);
        res.status(500).render("error", {
            message: "Failed to load activity log",
            user: req.user
        });
    }
});

app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
});

app.get("/database-status", async (req, res) => {
    try {
        const accounts = await pool.query("SELECT COUNT(*) as count FROM account");
        res.json({
            status: "connected",
            accounts: accounts.rows[0].count
        });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

app.listen(PORT, () => {
    console.log("🚀 Server running on http://localhost:" + PORT);
    console.log("📊 Database status: http://localhost:" + PORT + "/database-status");
});


module.exports = app;
