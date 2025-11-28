const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const env = require('dotenv').config();
const app = express();

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session and Flash Messages
const session = require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

const flash = require('connect-flash');
app.use(flash());

// Flash Messages Middleware
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Cookie Parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Routes
const staticRoute = require('./routes/static');
const inventoryRoute = require('./routes/inventory');
const accountRoute = require('./routes/account');

app.use(staticRoute);
app.use('/inv', inventoryRoute);
app.use('/account', accountRoute);

// Error handling
app.use((req, res) => {
  res.status(404).send('Sorry, page not found!');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start Server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log('Server running on port ' + port);
  console.log('Environment: ' + (process.env.NODE_ENV || 'development'));
});
