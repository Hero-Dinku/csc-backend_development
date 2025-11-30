const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Flash messages
app.use(flash());

// Task 5: Authentication middleware
const { jwtAuth } = require('./middleware/authMiddleware');
app.use(jwtAuth);

// Make flash messages and account data available to all views
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    res.locals.loggedin = req.loggedin || false;
    if (req.account) {
        res.locals.account_firstname = req.account.account_firstname;
        res.locals.account_type = req.account.account_type;
        res.locals.account_id = req.account.account_id;
    }
    next();
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Task 4: Routes
app.use('/account', require('./routes/accountRoutes'));
app.use('/inv', require('./routes/inventoryRoutes'));

// Home route - Amazing Homepage
app.get('/', async (req, res) => {
    try {
        const utilities = require('./utilities');
        let nav = await utilities.getNav();
        
        res.render('index', { 
            title: 'Premium Vehicle Management',
            nav,
            loggedin: req.loggedin,
            account: req.account
        });
    } catch (error) {
        console.error('Home route error:', error);
        res.render('index', { 
            title: 'Premium Vehicle Management',
            nav: [],
            loggedin: false
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        title: 'Server Error',
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', { 
        title: 'Page Not Found',
        message: 'The page you are looking for does not exist.'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
    console.log('Visit: http://localhost:' + PORT);
    console.log('Test login: http://localhost:' + PORT + '/account/test-data (creates test account)');
});

module.exports = app;
// Database status route (for testing)
app.get('/database-status', async (req, res) => {
    try {
        const utilities = require('./utilities');
        const isHealthy = await utilities.checkHealth();
        const nav = await utilities.getNav();
        const accountCount = await utilities.query('SELECT COUNT(*) FROM account');
        const inventoryCount = await utilities.query('SELECT COUNT(*) FROM inventory');
        
        res.json({
            database: 'PostgreSQL',
            status: isHealthy ? 'Connected' : 'Disconnected',
            classifications: nav.length,
            accounts: parseInt(accountCount.rows[0].count),
            inventory_items: parseInt(inventoryCount.rows[0].count),
            connection: {
                host: process.env.DB_HOST,
                database: process.env.DB_NAME,
                ssl: process.env.DB_SSL
            }
        });
    } catch (error) {
        res.status(500).json({
            database: 'PostgreSQL',
            status: 'Error',
            error: error.message
        });
    }
});
