const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Session middleware (using MemoryStore for simplicity)
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// EJS setup
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout');

// Flash messages middleware
app.use((req, res, next) => {
  res.locals.messages = req.session.messages || [];
  req.session.messages = [];
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/inv', require('./routes/inventory'));

// 404 Error handler
app.use((req, res, next) => {
  const error = new Error('Page Not Found');
  error.status = 404;
  next(error);
});

// Global error handler
app.use(async (error, req, res, next) => {
  let nav = '';
  try {
    const utilities = require('./utilities');
    nav = await utilities.getNav();
  } catch (e) {
    nav = '<nav class=\"navbar\"><ul><li><a href=\"/\" title=\"Home\">Home</a></li></ul></nav>';
  }
  
  res.status(error.status || 500);
  res.render('error', {
    title: error.status === 404 ? 'Page Not Found' : 'Server Error',
    message: error.message,
    nav: nav
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
