const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database
const pool = require('./config/database');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Auth middleware
function authMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect('/login');
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        next();
    } catch (err) {
        res.clearCookie('token');
        res.redirect('/login');
    }
}

// Routes
app.get('/', (req, res) => {
    // Try to get user from token
    const token = req.cookies.token;
    let user = null;
    
    if (token) {
        try {
            user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        } catch (err) {
            // Token invalid, clear it
            res.clearCookie('token');
        }
    }
    
    res.render('index', { 
        title: 'Home',
        user: user 
    });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login', error: null });
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Get user from database
        const result = await pool.query(
            'SELECT * FROM account WHERE account_email = $1',
            [email]
        );
        
        if (result.rows.length === 0) {
            return res.render('login', { 
                title: 'Login', 
                error: 'Invalid email or password' 
            });
        }
        
        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.account_password);
        
        if (!validPassword) {
            return res.render('login', { 
                title: 'Login', 
                error: 'Invalid email or password' 
            });
        }
        
        // Create JWT
        const token = jwt.sign(
            {
                account_id: user.account_id,
                account_firstname: user.account_firstname,
                account_lastname: user.account_lastname,
                account_email: user.account_email,
                account_type: user.account_type
            },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );
        
        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000 // 1 hour
        });
        
        res.redirect('/account/management');
        
    } catch (error) {
        console.error('Login error:', error);
        res.render('login', { 
            title: 'Login', 
            error: 'Server error' 
        });
    }
});

app.get('/account/management', authMiddleware, (req, res) => {
    const showGreeting = req.user.account_type !== 'Client';
    res.render('account/management', {
        title: 'Account Management',
        user: req.user,
        showGreeting
    });
});

app.get('/account/update', authMiddleware, (req, res) => {
    res.render('account/update', {
        title: 'Update Account',
        user: req.user,
        error: null
    });
});

app.post('/account/update', authMiddleware, async (req, res) => {
    try {
        const { firstname, lastname, email } = req.body;
        const userId = req.user.account_id;
        
        // Validation
        if (!firstname || !lastname || !email) {
            return res.render('account/update', {
                title: 'Update Account',
                user: req.user,
                error: 'All fields are required'
            });
        }
        
        // Update in database
        const result = await pool.query(
            `UPDATE account 
             SET account_firstname = $1, account_lastname = $2, account_email = $3 
             WHERE account_id = $4 
             RETURNING *`,
            [firstname, lastname, email, userId]
        );
        
        // Update JWT
        const updatedUser = result.rows[0];
        const token = jwt.sign(
            {
                account_id: updatedUser.account_id,
                account_firstname: updatedUser.account_firstname,
                account_lastname: updatedUser.account_lastname,
                account_email: updatedUser.account_email,
                account_type: updatedUser.account_type
            },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );
        
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000
        });
        
        res.redirect('/account/management');
        
    } catch (error) {
        console.error('Update error:', error);
        res.render('account/update', {
            title: 'Update Account',
            user: req.user,
            error: 'Update failed: ' + error.message
        });
    }
});

app.get('/account/update-password', authMiddleware, (req, res) => {
    res.render('account/update-password', {
        title: 'Update Password',
        user: req.user,
        error: null
    });
});

app.post('/account/update-password', authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const userId = req.user.account_id;
        
        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.render('account/update-password', {
                title: 'Update Password',
                user: req.user,
                error: 'All fields are required'
            });
        }
        
        if (newPassword !== confirmPassword) {
            return res.render('account/update-password', {
                title: 'Update Password',
                user: req.user,
                error: 'New passwords do not match'
            });
        }
        
        if (newPassword.length < 6) {
            return res.render('account/update-password', {
                title: 'Update Password',
                user: req.user,
                error: 'New password must be at least 6 characters'
            });
        }
        
        // Get current password
        const result = await pool.query(
            'SELECT account_password FROM account WHERE account_id = $1',
            [userId]
        );
        
        const user = result.rows[0];
        const validPassword = await bcrypt.compare(currentPassword, user.account_password);
        
        if (!validPassword) {
            return res.render('account/update-password', {
                title: 'Update Password',
                user: req.user,
                error: 'Current password is incorrect'
            });
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update password
        await pool.query(
            'UPDATE account SET account_password = $1 WHERE account_id = $2',
            [hashedPassword, userId]
        );
        
        res.redirect('/account/management');
        
    } catch (error) {
        console.error('Password update error:', error);
        res.render('account/update-password', {
            title: 'Update Password',
            user: req.user,
            error: 'Password update failed'
        });
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

app.get('/database-status', async (req, res) => {
    try {
        const accounts = await pool.query('SELECT COUNT(*) as count FROM account');
        const accountTypes = await pool.query('SELECT account_type, COUNT(*) FROM account GROUP BY account_type');
        
        res.json({
            status: 'connected',
            total_accounts: accounts.rows[0].count,
            account_types: accountTypes.rows,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
});

app.get('/test-accounts', (req, res) => {
    res.send(`
        <h1>Test Accounts</h1>
        <ul>
            <li><strong>Admin:</strong> admin@test.com / Test123!</li>
            <li><strong>Employee:</strong> employee@test.com / Test123!</li>
            <li><strong>Client:</strong> client@test.com / Test123!</li>
        </ul>
        <p><a href="/">Go to Home</a></p>
    `);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Database status: http://localhost:${PORT}/database-status`);
    console.log(`🔑 Test accounts: http://localhost:${PORT}/test-accounts`);
    console.log(`👤 Login: http://localhost:${PORT}/login`);
});


// Export the app for testing or other entry points
module.exports = app;

// Only start server if this file is run directly
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📊 Database status: http://localhost:${PORT}/database-status`);
        console.log(`🔑 Test accounts: http://localhost:${PORT}/test-accounts`);
        console.log(`👤 Login: http://localhost:${PORT}/login`);
    });
}
