require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session configuration - enhanced for production
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
    resave: false,
    saveUninitialized: false, // Changed to false for production
    cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS in production
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        httpOnly: true // Security enhancement
    }
}));

// Flash messages
app.use(flash());

// Make flash messages and user data available to all views
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    res.locals.user = req.session.user || null;
    res.locals.loggedin = !!req.session.user;
    next();
});

// View engine
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout');

// Routes
app.use('/', require('./routes/index'));
app.use('/inv', require('./routes/inventory'));
app.use('/account', require('./routes/account'));

// Health check route for Render
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV 
    });
});

// Error handling
app.use((req, res) => {
    res.status(404).render('404', { 
        title: 'Page Not Found',
        message: 'Sorry, the page you are looking for does not exist.'
    });
});

app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).render('500', { 
        title: 'Server Error',
        message: 'Something went wrong on our end. Please try again later.'
    });
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log('🚀 CSE Motors Server Started!');
    console.log('📍 Port:', PORT);
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
    console.log('📊 Database:', process.env.DB_NAME || 'Not configured');
    console.log('👉 Ready at: http://localhost:' + PORT);
});
